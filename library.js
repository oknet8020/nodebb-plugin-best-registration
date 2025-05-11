'use strict';

// ייבוא מודול async לעבודה אסינכרונית במסד הנתונים
const async = require('async');
// ייבוא מודול db של NodeBB לשמירת ושליפת שדות
const db = require.main.require('./src/database');

const plugin = {};

/**
 * filter:register.build
 * מוסיף שדות HTML לטופס ההרשמה
 */
plugin.addFields = function(hookData, callback) {
  // שורה: מוסיף שדה טקסט בשם 'businessName'
  hookData.fields.push({
    name: 'businessName',            // שם המפתח שישלח בטופס
    type: 'text',                    // סוג השדה
    label: 'שם העסק',                // התווית שתופיע למשתמש
    placeholder: 'הכנס את שם העסק',  // טקסט מילוי מקום
    validation: {
      required: true                 // שדה חובה
    }
  });

  // שורה: מוסיף שדה טקסט בשם 'businessAddress'
  hookData.fields.push({
    name: 'businessAddress',
    type: 'text',
    label: 'כתובת העסק',
    placeholder: 'הכנס את כתובת העסק',
    validation: {
      required: true
    }
  });

  // שורה: סיום הפונקציה, ממשיך לכריית שדות רגילה
  callback(null, hookData);
};

/**
 * filter:register.check
 * בודק שכל שדה הוזן כראוי לפני יצירת המשתמש
 */
plugin.checkFields = function(payload, callback) {
  const userData = payload.userData;  // data.session לפני הכתיבה למסד
  // שורה: אם לא הוזן שם העסק – מחזיר שגיאה
  if (!userData.businessName || !userData.businessName.trim()) {
    return callback(new Error('אנא מלא שם העסק')); 
  }
  // שורה: אם לא הוזנה כתובת העסק – מחזיר שגיאה
  if (!userData.businessAddress || !userData.businessAddress.trim()) {
    return callback(new Error('אנא מלא כתובת העסק')); 
  }
  // שורה: הכל תקין – ממשיכים בתהליך הרגיל
  callback(null, payload);
};

/**
 * action:user.create
 * שומר את השדות החדשים במסד הנתונים אחרי יצירת המשתמש
 */
plugin.saveFields = function(userData) {
  const uid = userData.uid;
  // שורה: אם קיים שם עסק – שמור אותו ב-hash של המשתמש
  if (userData.businessName) {
    db.setObjectField(`user:${uid}`, 'businessName', userData.businessName);
  }
  // שורה: אם קיימת כתובת – שמור אותה גם כן
  if (userData.businessAddress) {
    db.setObjectField(`user:${uid}`, 'businessAddress', userData.businessAddress);
  }
};

// ייצוא התוסף כדי ש־NodeBB יטען אותו
module.exports = plugin;
