import React, { useState } from 'react';
import StudentList from './StudentList';
import StudentDetails from './StudentDetails';

const StudentManagement = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedStudentId(null);
    setViewMode('list');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {viewMode === 'list' ? (
        <StudentList onStudentSelect={handleStudentSelect} />
      ) : (
        <StudentDetails 
          studentId={selectedStudentId} 
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default StudentManagement;