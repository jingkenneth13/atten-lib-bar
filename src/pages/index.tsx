// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
        
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, History, Scan } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import AttendanceHistory from '@/components/AttendanceHistory';
import StudentManager from '@/components/StudentManager';
import { toast } from 'sonner';

export interface Student {
  id: string;
  name: string;
  email: string;
  barcode: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  date: string;
  time: string;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('library-students');
    const savedAttendance = localStorage.getItem('library-attendance');
    
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    
    if (savedAttendance) {
      setAttendanceRecords(JSON.parse(savedAttendance));
    }
  }, []);

  // Save students to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('library-students', JSON.stringify(students));
  }, [students]);

  // Save attendance to localStorage whenever attendance changes
  useEffect(() => {
    localStorage.setItem('library-attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const handleBarcodeScanned = (barcode: string) => {
    console.log('Barcode scanned:', barcode);
    
    const student = students.find(s => s.barcode === barcode);
    
    if (student) {
      // Check if student already checked in today
      const today = new Date().toDateString();
      const existingRecord = attendanceRecords.find(
        record => record.studentId === student.id && 
        new Date(record.timestamp).toDateString() === today
      );

      if (existingRecord) {
        toast.error(`${student.name} has already checked in today at ${existingRecord.time}`);
        return;
      }

      // Create attendance record
      const now = new Date();
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId: student.id,
        studentName: student.name,
        timestamp: now.toISOString(),
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
      };

      setAttendanceRecords(prev => [newRecord, ...prev]);
      toast.success(`✅ ${student.name} checked in successfully!`);
    } else {
      toast.error('Student not found. Please register the student first.');
    }
    
    setIsScanning(false);
  };

  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setStudents(prev => [...prev, newStudent]);
    toast.success(`Student ${student.name} added successfully!`);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(r => r.studentId !== id));
    toast.success('Student deleted successfully!');
  };

  const getTodayAttendance = () => {
    const today = new Date().toDateString();
    return attendanceRecords.filter(
      record => new Date(record.timestamp).toDateString() === today
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Library Attendance System</h1>
          </div>
          <p className="text-gray-600 text-lg">Scan barcodes for quick and easy attendance tracking</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{students.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Attendance</CardTitle>
              <History className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{getTodayAttendance().length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
              <Scan className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{attendanceRecords.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-blue-600" />
                  Barcode Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isScanning ? (
                  <div className="text-center py-8">
                    <Button 
                      onClick={() => setIsScanning(true)}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                    >
                      <Scan className="h-5 w-5 mr-2" />
                      Start Scanning
                    </Button>
                    <p className="text-gray-600 mt-4">Click to start scanning student barcodes</p>
                  </div>
                ) : (
                  <BarcodeScanner 
                    onScan={handleBarcodeScanned}
                    onClose={() => setIsScanning(false)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <AttendanceHistory records={attendanceRecords} />
          </TabsContent>

          <TabsContent value="students">
            <StudentManager 
              students={students}
              onAddStudent={addStudent}
              onDeleteStudent={deleteStudent}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
