-- Smart Task Manager Database Setup
-- Run this script in SQL Server Management Studio or Azure Data Studio

-- Create the database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TaskManagerDB')
BEGIN
    CREATE DATABASE TaskManagerDB;
END
GO

USE TaskManagerDB;
GO

-- The tables will be created automatically by Entity Framework
-- when you run the .NET application for the first time

-- Optional: Create indexes for better performance
-- (These will also be created by Entity Framework, but you can run them manually if needed)

/*
CREATE INDEX IX_Tasks_UserId ON Tasks(UserId);
CREATE INDEX IX_Tasks_CreatedAt ON Tasks(CreatedAt);
CREATE INDEX IX_Tasks_Priority ON Tasks(Priority);
CREATE INDEX IX_Tasks_IsCompleted ON Tasks(IsCompleted);
CREATE INDEX IX_Tasks_Deadline ON Tasks(Deadline);
*/

-- Sample data (optional - for testing)
/*
-- This will be populated through the application
-- You can add sample tasks after registering a user
*/

PRINT 'Database setup completed. Tables will be created automatically when you run the .NET application.';