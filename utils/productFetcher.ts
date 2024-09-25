interface RCSProductData {
  ean: string;
  ean_tipo: string;
  cest: string;
  ncm: string;
  nome: string;
  nome_acento: string;
  unid_abr: string;
  unid_desc: string;
  marca: string;
  pais: string;
  categoria: string;
  dh_update: string;
  link_foto: string;
}

interface ProductData {
  ean: string;
  ean_tipo: string;
  nome: string;
  nome_acento: string;
  marca: string;
  pais: string;
  // image: string;
}

/**
 * Fetches an image from a given URL and converts it to a Base64 string.
 *
 * @param {string} imageUrl - The URL of the image to fetch.
 * @returns {Promise<string>} - A promise that resolves to the Base64 string of the image.
 */
// async function fetchImageAsBase64(imageUrl, token) {
//   try {
//     // Fetch the image as an arrayBuffer
//     const response = await fetch(imageUrl, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     // Check if the response is successful
//     if (!response.ok) {
//       throw new Error("Failed to fetch image");
//     }

//     const arrayBuffer = await response.arrayBuffer();

//     // Convert arrayBuffer to Buffer
//     const buffer = Buffer.from(arrayBuffer);

//     // Convert buffer to Base64
//     return `data:${response.headers.get(
//       "content-type"
//     )};base64,${buffer.toString("base64")}`;
//   } catch (error) {
//     console.error("Error fetching and converting image:", error);
//     throw error;
//   }
// }

// Usage Example

export async function fetchProductData(
  barcode: string,
  token: string
): Promise<ProductData> {
  console.log("fetching code: ", barcode);
  try {
    // https://gtin.rscsistemas.com.br/main
    const response = await fetch(
      `https://gtin.rscsistemas.com.br/api/gtin/infor/${barcode}`,
      // `https://cosmos.bluesoft.com.br/pesquisar?utf8=✓&q=${barcode}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        // body: JSON.stringify({
        //   gtin: barcode,
        // }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = (await response.json()) as unknown as RCSProductData;

    // Preciso ver um jeito de passar a imagem de forma mais eficiente para o front
    // const productImage = await fetchImageAsBase64(responseData.link_foto, token)
    //   .then((base64String) => {
    //     console.log("Base64 Image:", base64String);

    //     return base64String;
    //   })
    //   .catch((error) => {
    //     throw new Error(`Error fetching product image: ${error}`);
    //   });

    return {
      ean: responseData.ean,
      ean_tipo: responseData.ean_tipo,
      nome: responseData.nome,
      nome_acento: responseData.nome_acento,
      marca: responseData.marca,
      pais: responseData.pais,
      // image: productImage,
    };
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    throw error;
  }
}
