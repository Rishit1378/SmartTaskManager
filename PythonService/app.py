from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import re

app = Flask(__name__)
CORS(app)

def analyze_task_priority(title, description=None, deadline=None):
    """
    Analyze task priority based on title, description, and deadline
    Returns: dict with suggested_priority, reason, and confidence
    """
    
    # Initialize scoring
    priority_score = 0
    reasons = []
    
    # Analyze title for urgency keywords
    urgent_keywords = ['urgent', 'asap', 'emergency', 'critical', 'important', 'deadline', 'due']
    medium_keywords = ['meeting', 'review', 'update', 'check', 'follow up']
    low_keywords = ['research', 'read', 'learn', 'organize', 'clean']
    
    title_lower = title.lower()
    
    # Check for urgent keywords
    urgent_matches = sum(1 for keyword in urgent_keywords if keyword in title_lower)
    if urgent_matches > 0:
        priority_score += urgent_matches * 2
        reasons.append(f"Contains urgent keywords: {urgent_matches}")
    
    # Check for medium keywords
    medium_matches = sum(1 for keyword in medium_keywords if keyword in title_lower)
    if medium_matches > 0:
        priority_score += medium_matches * 1
        reasons.append(f"Contains medium priority keywords: {medium_matches}")
    
    # Check for low priority keywords
    low_matches = sum(1 for keyword in low_keywords if keyword in title_lower)
    if low_matches > 0:
        priority_score -= low_matches * 1
        reasons.append(f"Contains low priority keywords: {low_matches}")
    
    # Analyze description if provided
    if description:
        desc_lower = description.lower()
        urgent_desc_matches = sum(1 for keyword in urgent_keywords if keyword in desc_lower)
        if urgent_desc_matches > 0:
            priority_score += urgent_desc_matches
            reasons.append(f"Description contains urgent keywords: {urgent_desc_matches}")
    
    # Analyze deadline
    if deadline:
        try:
            deadline_dt = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
            now = datetime.now(deadline_dt.tzinfo)
            time_diff = deadline_dt - now
            
            if time_diff.total_seconds() < 0:
                priority_score += 5
                reasons.append("Task is overdue")
            elif time_diff.days <= 1:
                priority_score += 4
                reasons.append("Due within 1 day")
            elif time_diff.days <= 3:
                priority_score += 2
                reasons.append("Due within 3 days")
            elif time_diff.days <= 7:
                priority_score += 1
                reasons.append("Due within 1 week")
            else:
                reasons.append("Due in more than 1 week")
                
        except Exception as e:
            reasons.append("Could not parse deadline")
    
    # Determine priority based on score
    if priority_score >= 4:
        suggested_priority = "High"
        confidence = min(0.9, 0.6 + (priority_score - 4) * 0.1)
    elif priority_score >= 1:
        suggested_priority = "Medium"
        confidence = 0.7
    else:
        suggested_priority = "Low"
        confidence = 0.6
    
    # Create reason string
    reason = "; ".join(reasons) if reasons else "Based on general analysis"
    
    return {
        "suggested_priority": suggested_priority,
        "reason": reason,
        "confidence": round(confidence, 2)
    }

@app.route('/analyze', methods=['POST'])
def analyze_priority():
    """
    Endpoint to analyze task priority
    Expected JSON: {"title": "string", "description": "string", "deadline": "ISO datetime"}
    """
    try:
        data = request.get_json()
        
        if not data or 'title' not in data:
            return jsonify({"error": "Title is required"}), 400
        
        title = data.get('title', '')
        description = data.get('description', '')
        deadline = data.get('deadline')
        
        if not title.strip():
            return jsonify({"error": "Title cannot be empty"}), 400
        
        result = analyze_task_priority(title, description, deadline)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Task Priority Analyzer"})

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with API information"""
    return jsonify({
        "service": "Smart Task Manager - Priority Analysis Service",
        "version": "1.0.0",
        "endpoints": {
            "/analyze": "POST - Analyze task priority",
            "/health": "GET - Health check"
        },
        "example_request": {
            "title": "Fix critical bug in production",
            "description": "Users cannot login",
            "deadline": "2024-01-15T10:00:00Z"
        }
    })

if __name__ == '__main__':
    print("Starting Smart Task Manager - Priority Analysis Service")
    print("Service will be available at: http://localhost:5002")
    try:
        app.run(host='0.0.0.0', port=5002, debug=True)
    except Exception as e:
        print(f"Error starting Flask service: {e}")
        print("Make sure port 5002 is not in use by another application")
        input("Press Enter to exit...")