'use strict';

const plugin = {};

plugin.init = function (params, callback) {
  console.log('[custom-registration] תוסף הופעל');
  callback();
};

plugin.addFields = function (data, callback) {
  data.registrationForm = data.registrationForm || [];
  data.registrationForm.push({
    name: 'phone',
    label: 'מספר טלפון',
    type: 'text',
    placeholder: 'הכנס מספר טלפון'
  });
  callback(null, data);
};

module.exports = plugin;
