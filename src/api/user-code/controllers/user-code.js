'use strict';

/**
 *  user-code controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-code.user-code', ({strapi}) => ({
  async create(ctx, next){
    const { user } = ctx.state
    const { data } = await super.create(ctx, next);

    await strapi.entityService.update("api::user-code.user-code", data.id, {
      data: {
        status: 'pending',
        user: { id: user.id }
      }
    })

    return data;
  }
}));
