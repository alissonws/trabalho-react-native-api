import { Context } from "koa";
import { getOrRefreshToken } from "../../../../utils/tokenManager";
import { fetchProductData } from "../../../../utils/productFetcher";
import { factories } from "@strapi/strapi";

const mock = {
  ean: "7891095005895",
  ean_tipo: "EAN13",
  cest: "",
  ncm: "1901.90.90",
  nome: "FAROFA PRONTA YOKI 250G TRAD",
  nome_acento: "",
  unid_abr: "",
  unid_desc: "",
  marca: null,
  pais: "Brasil",
  categoria: null,
  dh_update: "2024-05-12 14:57:26",
  link_foto: "https://gtin.rscsistemas.com.br/api/gtin/img/7891095005895",
};

/**
 * product controller
*/

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    /**
     * Custom find method that filters price entries based on the authenticated user.
     *
     * @param {Context} ctx - The Koa context, containing the authenticated user and query params.
     * @returns {Promise<{ data: any, meta: any }>} - Returns the filtered price entries for the user.
     */
    async scan(ctx: Context): Promise<void> {
      const { barcode } = ctx.request.query;

      // ctx.body = mock;

      // return;
      const token = await getOrRefreshToken();

      if (token) {
        const productData = await fetchProductData(barcode, token);

        console.log("productData: ", productData, typeof productData);
        ctx.body = productData;
      } else {
        ctx.throw(401, "Unable to authenticate to third-party API");
      }
    },
  })
);
