'use strict';

// אובייקט התוסף שיייצא בסוף
const plugin = {};
plugin.addCaptcha = function(params, callback) {

	// 🟢 שדה נוסף: שם העסק
	const businessName = {
		label: 'שם העסק',
		html: '<div class="form-group"><input class="form-control" name="business-name" id="business-name" required /></div>'
	};

	// 🟢 שדה נוסף: כתובת עסק
	const businessAddress = {
		label: 'כתובת העסק',
		html: '<div class="form-group"><input class="form-control" name="business-address" id="business-address" required /></div>'
	};

	// 🧩 הוספת השדות לתוך הטופס
	if (params.templateData.regFormEntry && Array.isArray(params.templateData.regFormEntry)) {
		params.templateData.regFormEntry.push(businessName);
		params.templateData.regFormEntry.push(businessAddress);
	}

	callback(null, params);
};

plugin.checkRegister = function(params, callback) {
	// ✅ בדיקה של שדות חדשים
	if (!params.req.body['business-name']) {
		return callback({ source: 'business-name', message: 'יש לרשום שם עסק.' }, params);
	}

	if (!params.req.body['business-address']) {
		return callback({ source: 'business-address', message: 'יש לרשום כתובת העסק.' }, params);
	}

	callback(null, params);
};
plugin.saveBusinessData = function(userData) {
	const db = require.main.require('./src/database');
	const uid = userData.uid;

	db.setObjectField(`user:${uid}`, 'businessName', userData.req.body['business-name']);
	db.setObjectField(`user:${uid}`, 'businessAddress', userData.req.body['business-address']);
};

module.exports = plugin;
