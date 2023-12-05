'use strict';

/**
 * user-code router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::user-code.user-code');
