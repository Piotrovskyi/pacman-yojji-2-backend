const path = require('path');
const CRON = "0 */4 * * *";

module.exports = {
  pacmanExec: {
    task: async ({ strapi }) => {
      // return;
      try {
        const [engine] = await strapi.entityService.findMany('api::engine.engine', {
          sort: { createdAt: 'desc' },
          limit: 1
        });

        const entries = await strapi.entityService.findMany('api::user-code.user-code', {
          sort: { createdAt: 'asc' },
          populate: ['user', 'file'],
        });
        const codesByUser = entries.reduce((acc, code) => {
          acc[code.user.id] = code;
          return acc;
        }, {});

        // DO pacman exequtions
        const scores = [];
        for(const code of Object.values(codesByUser)) {
          let status;
          try {
            const codeToExec = require(path.join(__dirname, '..', `./public/uploads/${code.file.hash}${code.file.ext}`));

            const score = codeToExec(); // TODO add real score

            scores.push({
              data: {
                amount: score,
                publishedAt: new Date(),
                user: code.user.id,
                user_code: { id: code.id },
                // engine: engine.id  TODO sometimes not add engine to score
              },
            });
            status = 'executed';
          } catch(e) {
            status = 'error';
            console.error("execute user code error, user=", code.user.id, ' , ', e)
          } finally {
            strapi.entityService.update('api::user-code.user-code', code.id, {
              data: {
                status,
                executedAt: new Date().toISOString()
              }
            });
          }
        }

        const promises = scores.map(score => strapi.entityService.create('api::score.score', score));
        (await Promise.allSettled(promises)).forEach(({value, status, reason}) => {
          if(status === 'rejected') {
            console.error(reason); // TODO - id user code is not valid, do somthing with this error))
          }
          console.log('score created ->', value);

          strapi.db.connection('scores_engine_links')
            .insert({score_id: value.id, engine_id: engine.id})
            .catch(console.error);
        })
      } catch (err) {
        console.log(err)
      }
    },
    options: {
      rule: CRON
    },
  },
};
