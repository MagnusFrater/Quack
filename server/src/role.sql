CREATE TABLE TestSchema.Roles (
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	userID INT,
	courseID INT,
	type NVARCHAR(50)
);