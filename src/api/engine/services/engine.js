'use strict';

/**
 * engine service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::engine.engine');
