'use strict';

/**
 * user-code service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-code.user-code');
