
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Calendar, Clock, User } from 'lucide-react';
import { AttendanceRecord } from '@/pages/Index';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || record.date === new Date(selectedDate).toLocaleDateString();
    return matchesSearch && matchesDate;
  });

  const exportToCSV = () => {
    const csv = [
      ['Student Name', 'Date', 'Time', 'Timestamp'],
      ...filteredRecords.map(record => [
        record.studentName,
        record.date,
        record.time,
        record.timestamp
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTodayRecords = () => {
    const today = new Date().toDateString();
    return records.filter(record => new Date(record.timestamp).toDateString() === today);
  };

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calendar className="h-5 w-5" />
            Today's Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-800 mb-2">
            {getTodayRecords().length} students checked in
          </div>
          <p className="text-green-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No attendance records found</p>
                {searchTerm || selectedDate ? (
                  <p className="text-sm">Try adjusting your search criteria</p>
                ) : null}
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{record.studentName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {record.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {record.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Present
                  </Badge>
                </div>
              ))
            )}
          </div>

          {filteredRecords.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              Showing {filteredRecords.length} of {records.length} records
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;
