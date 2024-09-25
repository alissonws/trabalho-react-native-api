/**
 * price-entry controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::price-entry.price-entry",
  ({ strapi }) => ({
    /**
     * Custom find method that filters price entries based on the authenticated user.
     *
     * @param {Context} ctx - The Koa context, containing the authenticated user and query params.
     * @returns {Promise<{ data: any, meta: any }>} - Returns the filtered price entries for the user.
     */
    // DÉBITO TÉCNICO: tive que permitir o acesso ao endpoint User::find() o que gera uma falha de usuários podendo puxar a lista de usuários  
    async find(ctx) {
      // Get the authenticated user from the request context
      const user = ctx.state.user;

      // If no user is authenticated, return an error
      if (!user) {
        return ctx.badRequest("User not authenticated");
      }

      // Apply a filter to only retrieve entries associated with the authenticated user
      ctx.query.filters = {
        ...ctx.query.filters,
        user: {
          id: {
            $eq: user.id,
          },
        },
      };

      // Call the default core controller's find method with the updated context
      const { data, meta } = await super.find(ctx);

      // Return the filtered data and meta information
      return { data, meta };
    },
  })
);
