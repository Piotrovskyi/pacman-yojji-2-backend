'use strict';

/**
 *  engine controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::engine.engine');
