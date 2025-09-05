// Google Apps Script Backend for Kabwe Choir Management System
// This script handles all database operations with Google Sheets

// Configuration - Replace with your actual spreadsheet ID
const SPREADSHEET_ID = '1T7bEWz6VeLNqYFMCTsOltEoyYEtN9Psi2LOFbN5iYd4'; // Replace this!
const MEMBERS_SHEET = 'Members';
const ATTENDANCE_SHEET = 'Attendance';
const SETTINGS_SHEET = 'Settings';

// Initialize sheets structure
function initializeSheets() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Create Members sheet
    let membersSheet = ss.getSheetByName(MEMBERS_SHEET);
    if (!membersSheet) {
      membersSheet = ss.insertSheet(MEMBERS_SHEET);
      membersSheet.getRange(1, 1, 1, 7).setValues([
        ['ID', 'Name', 'Phone', 'Voice Part', 'Email', 'Registered Date', 'Status']
      ]);
      membersSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
    // Create Attendance sheet
    let attendanceSheet = ss.getSheetByName(ATTENDANCE_SHEET);
    if (!attendanceSheet) {
      attendanceSheet = ss.insertSheet(ATTENDANCE_SHEET);
      attendanceSheet.getRange(1, 1, 1, 7).setValues([
        ['ID', 'Member ID', 'Member Name', 'Date', 'Service Type', 'Status', 'Timestamp']
      ]);
      attendanceSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
    // Create Settings sheet
    let settingsSheet = ss.getSheetByName(SETTINGS_SHEET);
    if (!settingsSheet) {
      settingsSheet = ss.insertSheet(SETTINGS_SHEET);
      settingsSheet.getRange(1, 1, 1, 2).setValues([['Key', 'Value']]);
      settingsSheet.getRange(1, 1, 1, 2).setFontWeight('bold');
      
      // Add default settings
      settingsSheet.getRange(2, 1, 3, 2).setValues([
        ['adminPassword', 'admin123'],
        ['nextMemberId', '1'],
        ['nextAttendanceId', '1']
      ]);
    }
    
    return { success: true, message: 'Sheets initialized successfully' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// Web app entry point
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'getMembers':
        return createResponse(getMembers());
      case 'addMember':
        return createResponse(addMember(data.member));
      case 'updateMember':
        return createResponse(updateMember(data.member));
      case 'deleteMember':
        return createResponse(deleteMember(data.memberId));
      case 'getAttendance':
        return createResponse(getAttendance());
      case 'addAttendance':
        return createResponse(addAttendance(data.attendance));
      case 'deleteAttendance':
        return createResponse(deleteAttendance(data.attendanceId));
      case 'getSettings':
        return createResponse(getSettings());
      case 'updateSettings':
        return createResponse(updateSettings(data.settings));
      case 'initializeSheets':
        return createResponse(initializeSheets());
      case 'authenticateAdmin':
        return createResponse(authenticateAdmin(data.password));
      case 'authenticateMember':
        return createResponse(authenticateMember(data.name, data.phone));
      default:
        return createResponse({ success: false, message: 'Unknown action' });
    }
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

function doGet(e) {
  // Handle GET requests for CORS preflight
  return createResponse({ success: true, message: 'API is running' });
}

function createResponse(data) {
  const response = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  response.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  return response;
}

// Members operations
function getMembers() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBERS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) return { success: true, data: [] };
    
    const members = data.slice(1).map(row => ({
      id: row[0],
      name: row[1],
      phone: row[2],
      voicePart: row[3],
      email: row[4],
      registeredDate: row[5],
      status: row[6]
    }));
    
    return { success: true, data: members };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function addMember(member) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBERS_SHEET);
    
    // Get next ID
    const nextId = getNextId('nextMemberId');
    
    // Add member
    sheet.appendRow([
      nextId,
      member.name,
      member.phone,
      member.voicePart,
      member.email || '',
      member.registeredDate,
      member.status || 'Active'
    ]);
    
    // Update next ID
    updateNextId('nextMemberId', nextId + 1);
    
    return { success: true, data: { ...member, id: nextId } };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updateMember(member) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBERS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Find member row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == member.id) {
        sheet.getRange(i + 1, 1, 1, 7).setValues([[
          member.id,
          member.name,
          member.phone,
          member.voicePart,
          member.email || '',
          member.registeredDate,
          member.status
        ]]);
        return { success: true, data: member };
      }
    }
    
    return { success: false, message: 'Member not found' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deleteMember(memberId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBERS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Find and delete member row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == memberId) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Member deleted' };
      }
    }
    
    return { success: false, message: 'Member not found' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// Attendance operations
function getAttendance() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) return { success: true, data: [] };
    
    const attendance = data.slice(1).map(row => ({
      id: row[0],
      memberId: row[1],
      memberName: row[2],
      date: row[3],
      serviceType: row[4],
      status: row[5],
      timestamp: row[6]
    }));
    
    return { success: true, data: attendance };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function addAttendance(attendance) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
    
    // Get next ID
    const nextId = getNextId('nextAttendanceId');
    
    // Add attendance
    sheet.appendRow([
      nextId,
      attendance.memberId,
      attendance.memberName,
      attendance.date,
      attendance.serviceType,
      attendance.status,
      attendance.timestamp
    ]);
    
    // Update next ID
    updateNextId('nextAttendanceId', nextId + 1);
    
    return { success: true, data: { ...attendance, id: nextId } };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deleteAttendance(attendanceId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Find and delete attendance row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == attendanceId) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Attendance record deleted' };
      }
    }
    
    return { success: false, message: 'Attendance record not found' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// Settings operations
function getSettings() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SETTINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    const settings = {};
    for (let i = 1; i < data.length; i++) {
      settings[data[i][0]] = data[i][1];
    }
    
    return { success: true, data: settings };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updateSettings(newSettings) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SETTINGS_SHEET);
    
    Object.keys(newSettings).forEach(key => {
      updateSetting(key, newSettings[key]);
    });
    
    return { success: true, message: 'Settings updated' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updateSetting(key, value) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SETTINGS_SHEET);
  const data = sheet.getDataRange().getValues();
  
  // Find existing setting
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  
  // Add new setting
  sheet.appendRow([key, value]);
}

function getNextId(idType) {
  const settings = getSettings();
  return parseInt(settings.data[idType]) || 1;
}

function updateNextId(idType, nextId) {
  updateSetting(idType, nextId);
}

// Authentication
function authenticateAdmin(password) {
  try {
    const settings = getSettings();
    const adminPassword = settings.data.adminPassword || 'admin123';
    
    return {
      success: password === adminPassword,
      message: password === adminPassword ? 'Admin authenticated' : 'Invalid password'
    };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function authenticateMember(name, phone) {
  try {
    const members = getMembers();
    const member = members.data.find(m => 
      m.name.toLowerCase() === name.toLowerCase() && 
      m.phone === phone && 
      m.status === 'Active'
    );
    
    return {
      success: !!member,
      data: member,
      message: member ? 'Member authenticated' : 'Member not found or inactive'
    };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}
