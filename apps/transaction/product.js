//LIBRARIES
import "bootstrap";
import "slick-carousel";
import "validate";
import "message-es";
import lightbox from "lightbox2";

//FUNCTIONS
import getRequest from "../functions/getRequest";
import putRequest from "../functions/putRequest";
import patchRequest from "../functions/patchRequest";
import getParameterByUrl from "../functions/getParameterByUrl";
import capitalizeFirstLetter from "../functions/capitalizeFirstLetter";
import getProductRating from "../functions/getProductRating";
import deafultRatingsData from "../functions/deafultRatingsData";
import updateRatingData from "../functions/updateRatingData";
import updateSessionSkuCard from "../functions/updateSessionSkuCard";
import getUserFavorites from "../functions/getUserFavorites";
import renderAccesoriesItems from "../functions/renderAccesoriesItems";
import isMobile from "../functions/isMobile";
import getFullName from "../functions/getFullName";
import shareLink from "../functions/shareLink";
import getAvarage from "../functions/getAvarage";
import getMainOpinion from "../functions/getMainOpinion";
import renderStarsMainOpinion from "../functions/renderStarsMainOpinion";
import getAmountRatings from "../functions/getAmountRatings";
//import renderStarsAvarage from "../functions/renderStarsAvarage";
import html2string from "../functions/html2string";

//VARIABLES
import masterDataRequestHeader from "../variables/masterDataRequestHeader";
import categories_type from "../variables/categories_type";
//import colorName from "../variables/colorName";
import ratingValidation from "../variables/ratingValidation";
import sizeInCentimeters from "../variables/sizeInCentimeters";
import flavors from "../variables/flavors";
import accesoriesCarouselOptions from "../variables/accesoriesCarouselOptions";
import sizeForClothing from "../variables/sizeForClothing";
import sizeForFootgear from "../variables/sizeForFootgear";

let cant_slides = 0;

jQuery(document).ready(async function () {
  let og_title = $("meta[property='og:title']").attr("content");
  og_title = og_title.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
  jQuery("meta[property='og:title']").attr("content", og_title);

  let profile = await getRequest("/no-cache/profileSystem/getProfile", {
    "Content-Type": "application/json",
  });
  let user_favorites = await getUserFavorites(profile);
  let is_mobile = isMobile();

  /* jQuery(".Aleft").on("click", function () {
    jQuery(".img_slide_single").slick("slickPrev");
  });

  jQuery(".Aright").on("click", function () {
    jQuery(".img_slide_single").slick("slickNext");
  }); */

  jQuery(".lb-nav").on("click", function () {
    jQuery(".lb-close").trigger("click");
  });

  jQuery(".content_slider_look").slick({
    infinite: false,
    arrows: false,
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 800,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  });

  jQuery(".slick_insta").slick({
    infinite: false,
    arrows: false,
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 800,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  });

  let product = typeof skuJson_0 !== "undefined" ? skuJson_0.productId : "";
  let is_speciak_prod =
    vtxctx != undefined && (vtxctx.categoryId == 36 || vtxctx.categoryId == 37)
      ? true
      : false;

  const requestProduct = async(productId=null) =>{
    let a=1;
    a++;
    console.log(`se renderiza : ${a}`)
    if (product != "" && product != undefined && !is_speciak_prod) {
      let query = `fq=productId:${productId ? productId :product}`;
      let url = "/api/catalog_system/pub/products/search/?" + query;
      let headers = { "Content-Type": "application/json" };
      let result = await getRequest(url, headers);
      let flag_size = false;
      let flag_sabor = false;
      $("#tallas_container").empty();
  
      //Rating Logic
      let temp_product_raiting = await getProductRating(product);
      let main_opinion = getMainOpinion(temp_product_raiting);
      let [rating_1, rating_2, rating_3, rating_4, rating_5] =
        getAmountRatings(temp_product_raiting);
      let { avarage, number } = getAvarage(temp_product_raiting);
      let raiting_total =
        number !== 1
          ? `Basado en ${number} valoraciones`
          : `Basado en ${number} valoración`;
      let main_opinion_html =
        main_opinion !== null
          ? `
            <div class="head">
              <div>
                <p>${main_opinion.titulo}</p>
                <p>${main_opinion.fecha.split(" ")[0]}</p>
              </div>
              <div>
                <div>${renderStarsMainOpinion(
                  parseInt(main_opinion.num_stars)
                )}</div>
                <div>${main_opinion.name}</div>
              </div>
              
            </div>
            <div class="coment">
              <p>
                ${main_opinion.descripcion}
              </p>
            </div>`
          : `<p class="empty_opinion"> Se el primero en dejar tu opinión</p>`;
  
      //let stars_avarage = renderStarsAvarage(avarage, result.productId);
  
      //Render Rating Data
      /* jQuery(".product_main_information_container .raiting .estrellas").html(
        stars_avarage
      ); */
      //jQuery(".product_main_information_container .raiting p").html(avarage);
      jQuery(".valor_exp_desk .average").html(avarage);
      jQuery(".valoracion .content_value h3").html(avarage);
      jQuery(".valor_exp_desk .raiting_total").html(raiting_total);
      jQuery(".valoracion .content_value p").html(raiting_total);
      jQuery(".valor_exp_desk .two .content_two").html(main_opinion_html);
      jQuery(".valor_exp_desk .quanty > div:nth-child(1)").html(`<span>1</span>
        <i class="fa fa-star"></i>
        <div class="bar"></div>
        <span>${rating_1}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(2)").html(`<span>2</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_2}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(3)").html(`<span>3</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_3}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(4)").html(`<span>4</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_4}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(5)").html(`<span>5</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_5}</span>`);
  
      //Accesorios
      let accesories_url = `/api/catalog_system/pub/products/crossselling/accessories/${product}`;
      let accesories_headers = {
        Accept: "application/json; charset=utf-8",
        "X-VTEX-API-AppKey": APP_KEY,
        "X-VTEX-API-AppToken": APP_TOKEN,
      };
      let accesories = await getRequest(accesories_url, accesories_headers);
  
      renderAccesoriesItems(
        accesories,
        ".tambien_slick",
        ".content_slider",
        accesoriesCarouselOptions
      );
  
      if (result.length) {
        let {
          productName,
          items,
          description,
          Modelo,
          productId,
          categories,
          Color,
          linkText,
          link,
          clusterHighlights,
        } = result[0];
  
        let cluster_highlights_array = clusterHighlights
          ? Object.values(clusterHighlights)
          : null;
  
        let product_labels =
          cluster_highlights_array !== null
            ? cluster_highlights_array
                .map(
                  (highlight) =>
                    `<label class="colleccion_label">${highlight}</label>`
                )
                .join("")
            : "";
  
        jQuery(".labels-group").append(product_labels);
  
        let relacionado_tipo = Modelo != undefined ? Modelo[0] : "";
  
        let description_info = result[0].hasOwnProperty(
          "Descripcion personalizada"
        )
          ? result[0]["Descripcion personalizada"]
          : "";
        let details = result[0].hasOwnProperty("Composicion personalizada")
          ? result[0]["Composicion personalizada"]
          : "";
        let sizes = result[0].hasOwnProperty("Medida personalizada")
          ? result[0]["Medida personalizada"]
          : "";
  
        let type_cat = categories_type.hasOwnProperty([
          categories[0].toLowerCase(),
        ])
          ? categories_type[categories[0].toLowerCase()]
          : 2;
  
        let skus = {};
  
        /** Adding description meta pixel fb */
        let og_description = description_info;
        og_description = html2string(og_description);
  
        jQuery("meta[property='og:description']").attr("content", og_description);
        /** End adding description meta pixel fb*/
  
        for (let index = 0; index < items.length; index++) {
          let { sellers, images, referenceId, itemId } = items[index];
          let { commertialOffer, addToCartLink } = sellers[0];
          let { Price, ListPrice, AvailableQuantity } = commertialOffer;
  
          //if (Price > 0 && images != null && images.length > 0 && AvailableQuantity > 0) {
          if (Price > 0 && images != null && images.length > 0) {
            /* Logic to show colors */
            let color_principal = result[0].hasOwnProperty("Color Principal")
              ? result[0]["Color Principal"][0]
              : "";
            if (color_principal != "") {
              let new_colors = [];
              new_colors.push(color_principal);
              for (let index = 0; index < Color.length; index++) {
                if (Color[index] != color_principal) {
                  new_colors.push(Color[index]);
                }
              }
              Color = new_colors.length < 2 ? Color : new_colors;
            }
            /* -------- */
  
            Color =
              Color != undefined
                ? Color.length < 2
                  ? Color[0]
                  : Color[0] + " - " + Color[1]
                : "";
  
            let data = {
              itemId: itemId,
              images: images,
              addToCartLink: addToCartLink,
              Price: Price,
              ListPrice: ListPrice,
              AvailableQuantity: AvailableQuantity,
              referenceId: referenceId,
              Color: Color,
            };
  
            if (type_cat == 1 || type_cat == 4 || type_cat == 5) {
              let size = items[index].Talla[0];
              size = size.replace(/ /g, "");
              skus[size] = {};
              skus[size] = data;
              flag_size = true;
            } else if (type_cat == 3) {
              let sabor = items[index].PACK[0];
              sabor = sabor.replace(/ /g, "");
              skus[sabor] = {};
              skus[sabor] = data;
              flag_sabor = true;
            } else {
              skus[itemId] = {};
              skus[itemId] = data;
            }
          }
        }
  
        let idx =
          Object.keys(skus).filter((item) => item[0] === "S").length > 0
            ? Object.keys(skus).filter((item) => item[0] === "S")
            : Object.keys(skus)[0];
  
        let {
          itemId,
          images,
          addToCartLink,
          Price,
          ListPrice,
          AvailableQuantity,
          referenceId,
        } = skus[idx];
        let color_default = skus[idx].Color;
  
        /* Breadcrumb */
        let script_data = vtxctx;
        let { categoryName, departmentName } = script_data;
        let category_name = categoryName.toLowerCase();
        let department_name = departmentName.toLowerCase();
  
        let slide_content_galery_nav = "";
        let img_slide_single = "";
        let img_slide_single_mobile = "";
  
        let breadcrubs_list = "";
        let breadcrumb_mobile = "";
  
        if (department_name == category_name) {
          breadcrubs_list = `<li class="breadcrumb-item"> <a href="/">Home</a> </li>
          <li class="breadcrumb-item active" aria-current="page"> <a href="/${departmentName
            .toLowerCase()
            .split(" ")
            .join("-")}">${capitalizeFirstLetter(department_name)}</a> </li>`;
  
          breadcrumb_mobile = `<a href="/${departmentName
            .toLowerCase()
            .split(" ")
            .join("-")}"> ${capitalizeFirstLetter(departmentName)} </a>`;
        } else {
          breadcrubs_list = `<li class="breadcrumb-item"> <a href="/">Home</a> </li>
          <li class="breadcrumb-item"> <a href="/${departmentName
            .toLowerCase()
            .split(" ")
            .join("-")}">${capitalizeFirstLetter(department_name)}</a> </li>
          <li class="breadcrumb-item active" aria-current="page"> <a href="/${departmentName
            .toLowerCase()
            .split(" ")
            .join("-")}/${category_name
            .toLowerCase()
            .split(" ")
            .join("-")}"> ${capitalizeFirstLetter(category_name)} 
            </a></li>
            
            <li class="breadcrumb-item active" aria-current="page"> <a class="breadProduct" href="/${linkText}/p">${productName
            .toLowerCase()
            .split(" ")
            .join("-")}</a></li>
            `;
  
          breadcrumb_mobile = `<a href="/${departmentName
            .toLowerCase()
            .split(" ")
            .join("-")}/${category_name
            .toLowerCase()
            .split(" ")
            .join("-")}"> ${capitalizeFirstLetter(category_name)}
            </a>`;
        }
  
        jQuery(".custom_breadcrumb").html(breadcrubs_list);
        jQuery(".toback a").html(breadcrumb_mobile);
  
        jQuery(".copyText").attr("data-link", link);
  
        /* Checking type product */
        if (type_cat == 0) {
          jQuery(".tallas_prods").addClass("hide");
        }
  
        if (type_cat !== 2) {
          let url_tipo = `/api/catalog_system/pub/products/search/?fq=specificationFilter_20:${relacionado_tipo}`;
  
          let color_result = await getRequest(url_tipo, headers);
  
          if (color_result.length) {
            let color_list = "";
  
            color_result.forEach((resultado, index) => {
              let { Color, items, productName, description, link, linkText } =
                resultado;
              let productId_item = resultado.productId;
              let imgs = items[0].images;
              let { sellers, itemId, referenceId } = items[0];
              let { commertialOffer, addToCartLink } = sellers[0];
              let { Price, ListPrice, AvailableQuantity } = commertialOffer;
  
              const isAvailableColor = items.some(
                (item) => item?.sellers[0]?.commertialOffer?.AvailableQuantity > 0
              );
  
              if (
                Price > 0 &&
                isAvailableColor === true &&
                imgs != undefined &&
                imgs.length > 0
              ) {
                /* Logic to show colors */
                let color_principal = resultado.hasOwnProperty("Color Principal")
                  ? resultado["Color Principal"][0]
                  : "";
  
                if (color_principal != "") {
                  let new_colors = [];
  
                  new_colors.push(color_principal);
  
                  for (let index = 0; index < Color.length; index++) {
                    if (Color[index] != color_principal) {
                      new_colors.push(Color[index]);
                    }
                  }
  
                  Color = new_colors.length < 2 ? Color : new_colors.reverse();
                }
                /* -------- */
  
                let resultado_productId = resultado.productId;
                let color_class =
                  Color.length < 2
                    ? `${Color[0].toLowerCase().replace(/\s/g, "_")} _${Color[0]
                        .toLowerCase()
                        .replace(/\s/g, "_")}`
                    : `${Color[0].toLowerCase().replace(/\s/g, "_")} _${Color[1]
                        .toLowerCase()
                        .replace(/\s/g, "_")}`;
                let color_name =
                  Color.length < 2
                    ? `${Color[0].toLowerCase()}`
                    : `${Color[1].toLowerCase()} - ${Color[0].toLowerCase()}`;
                let true_color_class =
                  resultado_productId == productId
                    ? `${color_class} active`
                    : `${color_class}`;
  
                let reformattedArray = imgs.map(function (obj) {
                  let rObj = {};
                  rObj.imageLabel = obj.imageLabel;
                  rObj.imageUrl = obj.imageUrl;
                  rObj.imageId = obj.imageId;
                  return rObj;
                });
  
                let imgs_array = reformattedArray;
  
  
                color_list += `<a class="btn_change_sku list_color_element" 
                  data-productId="${productId_item}"
                  data-sku-id="${itemId}"
                  data-productName="${productName}"
                  data-referenceId="${referenceId[0].Value}"
                  data-Price="${Price}"
                  data-ListPrice="${ListPrice}"
                  data-description="${description}"
                  data-url="${link}"
                  data-linktext="/${linkText}/p"
                  data-seller="${getParameterByUrl("seller", addToCartLink)}"
                  data-sc="${getParameterByUrl("sc", addToCartLink)}"
                  data-color="${color_name}"
                  data-imgs='${JSON.stringify(imgs_array)}'
                  data-available='${AvailableQuantity}'
                  data-details='${details}'
                >
                  <span class="color_item__circle ${true_color_class}"></span>
                  <span class="color_name">${color_name}</span>
                </a>`;
              }
            });
  
            jQuery(".colores_products .items").html(color_list);
            jQuery(".colores_products").removeClass("hide");
          }
        }
  
        if (type_cat == 1) {
          jQuery(".guia_tallas_modal #modal_guia_tallas").text("Cinturones");
          jQuery(".guia_tallas_modal .table_correas_content").removeClass("hide");
          jQuery(".guia_tallas_modal .table_zapatos_content").addClass("hide");
          jQuery(".guia_tallas_modal .table_casacas_content").addClass("hide");
  
          let options = "";
  
          Object.keys(sizeInCentimeters).forEach((key) => {
            if (skus.hasOwnProperty(key)) {
              let sku = skus[key].itemId;
              let seller = getParameterByUrl("seller", skus[idx].addToCartLink);
              let sc = getParameterByUrl("seller", skus[idx].addToCartLink);
              let color = skus[key].Color;
              let selected = key == idx ? "selected" : "";
              let quantity = skus[key].AvailableQuantity;
              let price = parseFloat(skus[key].Price)
                .toFixed(2)
                .toLocaleString("en-US");
  
              /* options =
                options +
                `<option data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}" ${selected}> ${sizeInCentimeters[key]} </option>`; */
              if (quantity !== 0 ) {
                options =
                options +
                `<button class="button_size ${selected}" data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <span class="talla_nombre"> ${sizeInCentimeters[key]} </span>
                  <span class="talla_sub_nombre"> ${`(${key})`} </span>
                </button>`;
              }
              else {
                options =
                options +
                `<button class="button_size ${selected}" data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <div class="line_button"></div>
                  <span class="talla_nombre"> ${sizeInCentimeters[key]} </span>
                  <span class="talla_sub_nombre"> ${`(${key})`}  </span>
                </button>`;
              }
            }
          });
  
          //$("#size_product_esp").empty().append(options);
          $("#tallas_container").empty().html(options);
        } else if (type_cat == 3) {
          jQuery(".btn_guia_tallas").addClass("hide");
          jQuery(".msg_tallas").html(`<div><p>Sabores disponibles</p></div>`);
  
          let options = "";
  
          Object.keys(flavors).forEach((key) => {
            if (skus.hasOwnProperty(key)) {
              let sku = skus[key].itemId;
              let seller = getParameterByUrl("seller", skus[idx].addToCartLink);
              let sc = getParameterByUrl("seller", skus[idx].addToCartLink);
              let selected = key == idx ? "selected" : "";
  
            /*   options =
                options +
                `<option data-sabor="${flavors[key]}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}" ${selected}> ${flavors[key]} </option>`; */
              
              if (quantity !== 0 ) {
                options =
                options +
                `<button class="button_size ${selected}" data-sabor="${flavors[key]}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <span class="talla_nombre"> ${key} </span>
                  <span class="talla_sub_nombre"> ${flavors[key]} </span>
                </button>`;
              }
              else {
                options =
                options +
                `<button class="button_size ${selected}" data-sabor="${flavors[key]}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <div class="line_button"></div>
                  <span class="talla_nombre"> ${key} </span>
                  <span class="talla_sub_nombre"> ${flavors[key]} </span>
                </button>`;
              }
            }
          });
  
          //$("#size_product_esp").empty().append(options);
          $("#tallas_container").empty().html(options);
        } else if (type_cat == 4) {
          jQuery(".guia_tallas_modal #modal_guia_tallas").text("Casacas");
          jQuery(".guia_tallas_modal .table_correas_content").addClass("hide");
          jQuery(".guia_tallas_modal .table_zapatos_content").addClass("hide");
  
          let tabla_tallas = result[0].hasOwnProperty("tablaTallas")
            ? result[0]["tablaTallas"][0]
            : null;
  
          let modelo_value = result[0].hasOwnProperty("Modelo")
            ? `MODELO ${result[0]["Modelo"][0]}`
            : null;
  
          let category = result[0]["categories"][0];
          let isMan = category.toLowerCase().includes("hombre");
  
          if (tabla_tallas == null) {
            jQuery(".btn_guia_tallas").addClass("hide");
          }
  
          if (isMan) {
            jQuery(
              ".guia_tallas_modal .table_casacas_content .table_casacas_image .casacas_image_hombre"
            ).removeClass("hide");
          } else {
            jQuery(
              ".guia_tallas_modal .table_casacas_content .table_casacas_image .casacas_image_mujer"
            ).removeClass("hide");
          }
  
          jQuery(".guia_tallas_modal .table_casacas_content .table_casacas").html(
            tabla_tallas
          );
          jQuery(
            ".guia_tallas_modal .table_casacas_content .table_casacas_content_title .text"
          ).html(modelo_value);
          jQuery(".guia_tallas_modal .table_casacas_content").removeClass("hide");
  
          let options = "";
  
          Object.keys(sizeForClothing).forEach((key) => {
            if (skus.hasOwnProperty(key)) {
              let sku = skus[key].itemId;
              let seller = getParameterByUrl("seller", skus[idx].addToCartLink);
              let sc = getParameterByUrl("seller", skus[idx].addToCartLink);
              let color = skus[key].Color;
              let selected = key == idx ? "selected" : "";
              let quantity = skus[key].AvailableQuantity;
              let price = parseFloat(skus[key].Price)
                .toFixed(2)
                .toLocaleString("en-US");
  
              /* options =
                options +
                `<option data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}" ${selected}> ${sizeForClothing[key]} </option>`; */
  
              if (quantity !== 0 ) {
                options =
                options +
                `<button class="button_size ${selected}" data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <span class="talla_nombre"> ${key} </span>
                  <span class="talla_sub_nombre"> ${sizeForClothing[key]} </span>
                </button>`;
              }
              else {
                options =
                options +
                `<button class="button_size ${selected}" data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <div class="line_button"></div>
                  <span class="talla_nombre"> ${key} </span>
                  <span class="talla_sub_nombre"> ${sizeForClothing[key]} </span>
                </button>`;
              }
               
            }
          });
  
          //$("#size_product_esp").empty().append(options);
          $("#tallas_container").empty().html(options);
        } else if (type_cat == 5) {
          jQuery(".guia_tallas_modal #modal_guia_tallas").text("Calzado");
          jQuery(".guia_tallas_modal .table_correas_content").addClass("hide");
          jQuery(".guia_tallas_modal .table_casacas_content").addClass("hide");
  
          let tabla_tallas = result[0].hasOwnProperty("tablaTallas")
            ? result[0]["tablaTallas"][0]
            : null;
  
          let modelo_value = result[0].hasOwnProperty("Modelo")
            ? `MODELO ${result[0]["Modelo"][0]}`
            : null;
  
          if (tabla_tallas == null) {
            jQuery(".btn_guia_tallas").addClass("hide");
          }
  
          jQuery(".guia_tallas_modal .table_zapatos_content .table_zapatos").html(
            tabla_tallas
          );
          jQuery(
            ".guia_tallas_modal .table_zapatos_content .table_zapatos_content_title .text"
          ).html(modelo_value);
          jQuery(".guia_tallas_modal .table_zapatos_content").removeClass("hide");
  
          let options = "";
  
          Object.keys(sizeForFootgear).forEach((key) => {
            if (skus.hasOwnProperty(key)) {
              let sku = skus[key].itemId;
              let seller = getParameterByUrl("seller", skus[idx].addToCartLink);
              let sc = getParameterByUrl("seller", skus[idx].addToCartLink);
              let color = skus[key].Color;
              let selected = key == idx ? "selected" : "";
              let quantity = skus[key].AvailableQuantity;
              let price = parseFloat(skus[key].Price)
                .toFixed(2)
                .toLocaleString("en-US");
  
              /* options =
                options +
                `<option data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}" ${selected}> ${sizeForFootgear[key]} </option>`; */
              if (quantity !== 0 ) {
                options =
                options +
                `<button class="button_size ${selected}" data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <span class="talla_nombre">  ${key} </span>
                </button>`;
              }
              else {
                options =
                options +
                `<button class="button_size ${selected}" data-price="${price}" data-quantity="${quantity}" data-color="${color}" data-size="${key}" data-sku="${sku}" data-seller="${seller}" data-sc="${sc}" value="${key}">
                  <div class="line_button"></div>
                  <span class="talla_nombre"> ${key} </span>
                </button>`;
              }
            }
          });
  
          //jQuery("#size_product_esp").empty().append(options);
          $("#tallas_container").empty().html(options);
  
        } else {
          //jQuery(".colores_products").addClass("hide");
          jQuery(".tallas_prods").addClass("hide");
        }
  
        if (images.length) {
          cant_slides = images.length > 1 ? 2 : 1;
          let init_idx = images.length > 1 ? 1 : 0;
          for (let index = init_idx; index < images.length; index++) {
            slide_content_galery_nav += `<div class="color_item btn_image_scroll mini-${images[index].imageId}" data-scroll-item="image-${images[index].imageId}">
              <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}" />
            </div>`;
  
            img_slide_single += `<a class="image-link image-${images[index].imageId}" href="${images[index].imageUrl}" data-mini="mini-${images[index].imageId}" data-lightbox="product-image">
              <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}"/>
            </a>`;
  
            img_slide_single_mobile += `<a class="image-link" href="${images[index].imageUrl}" data-lightbox="product-image-mobile">
              <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}"/>
            </a>`;
          }
        }
  
        let hasDiscount = Price == ListPrice ? false : true;
        let discount = hasDiscount ? 100 - (Price * 100) / ListPrice : 0;
        let price_format = parseFloat(Price).toFixed(2).toLocaleString("en-US");
        let list_price_format = parseFloat(ListPrice)
          .toFixed(2)
          .toLocaleString("en-US");
        let discount_format = parseFloat(discount).toFixed(0);
  
        jQuery(".description .title h1").html(productName);
        //jQuery("#skuNumber").html(referenceId[0].Value);
        jQuery(".description .content_price .price").html(`S/ ${price_format}`);
        jQuery(".description .content_price .before_price").html(
          hasDiscount ? `S/ ${list_price_format}` : ""
        );
        jQuery(".description .content_price .discount").html(
          hasDiscount ? `${discount_format}% dcto.` : ""
        );
  
        jQuery(".texto_descripcion_desk, .texto_descripcion_mobile").html(
          `<p>${description}</p>`
        );
        $(".slide_content_galery_nav").length && jQuery(".slide_content_galery_nav").html(slide_content_galery_nav);
        $(".img_slide_single").length && jQuery(".img_slide_single").html(img_slide_single);
        $(".slider_product").length && jQuery(".slider_product").html(img_slide_single_mobile);
  
        jQuery(".btn-buy").attr("data-sku", itemId);
        jQuery(".btn-buy").attr("data-quantity", 1);
        jQuery(".btn-buy").attr(
          "data-seller",
          getParameterByUrl("seller", addToCartLink)
        );
        jQuery(".btn-buy").attr(
          "data-sc",
          getParameterByUrl("sc", addToCartLink)
        );
        jQuery(".btn-buy").attr("data-color", color_default);
  
        flag_size ? jQuery(".btn-buy").attr("data-size", idx) : null;
        flag_sabor ? jQuery(".btn-buy").attr("data-sabor", flavors[idx]) : null;
  
        //Check stock
        AvailableQuantity === 0
          ? jQuery(".btn-buy").attr("disabled", "disabled")
          : null;
        AvailableQuantity === 0 ? jQuery(".btn-buy").text("Agotado") : null;
        AvailableQuantity === 0
          ? jQuery(".btn_container .notifyme-form p").text(
              "Déjanos tu nombre y correo. Te avisaremos cuando el producto este disponible."
            )
          : null;
  
        AvailableQuantity === 0
          ? jQuery(
              '.btn_container .notifyme-form input[name="notifymeClientName"]'
            ).attr("placeholder", "Ingrese Correo")
          : null;
  
        AvailableQuantity === 0
          ? jQuery(
              '.btn_container .notifyme-form input[name="notifymeClientName"]'
            ).val("")
          : jQuery(
              '.btn_container .notifyme-form input[name="notifymeClientName"]'
            ).val("renzocosta");
  
        AvailableQuantity === 0
          ? jQuery(
              '.btn_container .notifyme-form input[name="notifymeClientEmail"]'
            ).attr("placeholder", "Ingrese Correo")
          : null;
  
        AvailableQuantity === 0
          ? jQuery('.btn_container .notifyme-form input[type="button"]').val(
              "Notificar"
            )
          : null;
  
        AvailableQuantity === 0
          ? jQuery(".btn_container fieldset .notifyme-success").text(
              "Notificación exitosa, le enviaremos un correo electrónico cuando el producto este disponible."
            )
          : null;
  
        AvailableQuantity === 0
          ? jQuery(".btn_container").addClass("hide")
          : null;
  
        jQuery(".button_ranting_modal").attr("data-product-id", productId);
        jQuery(".btn_add_favorites").attr("data-sku-id", itemId);
  
        if (user_favorites != "") {
          user_favorites.skus.includes(itemId)
            ? jQuery(".btn_add_favorites")
                .addClass("icons-renzo-costa-hearth-bg")
                .removeClass("icons-renzo-costa-hearth")
            : "";
        }
  
        jQuery(".info_description .property").html(description_info);
  
        jQuery(".info_details .composition").html(`
          <div class="composition_row">
            <span>
              SKU: ${referenceId[0].Value}
              <span>
                <p>${description}</p>
              </span>
            </span> 
          </div>
          <div class="composition_row">
            <span>
              COMPOSICIÓN
              <span>${details}</span> 
            </span>   
          </div>
        `);
  
        if (type_cat === 6) {
          jQuery(".info_details .composition").addClass("hide");
        }
  
        jQuery(".info_details .sizes").html(`
          <span>MEDIDAS</span>
          ${
            type_cat == 4 || type_cat == 1 || type_cat == 5
              ? `<a class="btn_guia_tallas" data-toggle="modal" data-target=".guia_tallas_modal">${sizes}</a>`
              : `<span>${sizes}</span>`
          }
        `);
  
        /** Adding description meta pixel fb */
        og_description = description_info;
        og_description = html2string(og_description);
        jQuery("meta[property='og:description']").attr("content", og_description);
  
        jQuery("head").append(
          `<meta property="og:price:amount" content="${price_format}" />`
        );
        jQuery("head").append(
          `<meta property="og:price:currency" content="PEN" />`
        );
        jQuery("head").append(
          `<meta property="product:brand" content="Renzo Costa" />`
        );
        jQuery("head").append(
          `<meta property="product:availability" content="${
            AvailableQuantity > 0 ? "in stock" : "out stock"
          }" />`
        );
        jQuery("head").append(
          `<meta property="product:condition" content="new" />`
        );
        jQuery("head").append(
          `<meta property="product:price:amount" content="${price_format}" />`
        );
        jQuery("head").append(
          `<meta property="product:price:currency" content="PEN" />`
        );
        jQuery("head").append(
          `<meta property="product:retailer_item_id" content="${product}" />`
        );
  
        /** End adding description meta pixel fb*/
  
        setTimeout(function () {
          jQuery(".slider_product").slick({
            infinite: false,
            arrows: false,
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: ".slide_content_galery_nav",
          });
  
          jQuery(".slide_content_galery_nav")
            .on("init", function (event, slick) {
              jQuery(
                ".slide_content_galery_nav .slick-slide.slick-current"
              ).addClass("is-active");
            })
            .slick({
              slidesToShow: 5,
              slidesToScroll: 1,
              dots: false,
              focusOnSelect: true,
              centerMode: true,
              infinite: false,
              asNavFor: ".slider_product",
            });
        }, 1000);
  
        //jQuery('.mosaico').addClass(category_name);
        relacionado_tipo == "WP ETR-20 7553"
          ? ""
          : jQuery(".mosaico").addClass("billeteras");
  
        //Page loaded
        jQuery("body").addClass("loaded");
  
        lightbox.option({
          resizeDuration: 200,
          wrapAround: false,
          fitImagesInViewport: false,
          maxWidth: null,
          maxHeight: null,
        });
      }
    }
  }

  requestProduct()

  if (is_speciak_prod) {
    let sku_id = vtxctx.skus;
    let query = `fq=skuId:${sku_id}`;
    let url = "/api/catalog_system/pub/products/search/?" + query;
    let headers = { "Content-Type": "application/json" };
    let result = await getRequest(url, headers);

    if (result.length) {
      let description_info = result[0].hasOwnProperty(
        "Descripcion personalizada"
      )
        ? result[0]["Descripcion personalizada"]
        : "";
      let details = result[0].hasOwnProperty("Composicion personalizada")
        ? result[0]["Composicion personalizada"]
        : "";
      let sizes = result[0].hasOwnProperty("Medida personalizada")
        ? result[0]["Medida personalizada"]
        : "";
      let item_id_perfume = result[0].items[0].kitItems[0].itemId;
      let { productName, productId, description, productReference } = result[0];

      let { sellers, images } = result[0].items[0];
      let { commertialOffer, addToCartLink } = sellers[0];
      let PriceProduct = commertialOffer.Price;
      let ListPriceProduct = commertialOffer.ListPrice;

      //Rating Logic
      let temp_product_raiting = await getProductRating(productId);
      let main_opinion = getMainOpinion(temp_product_raiting);
      let [rating_1, rating_2, rating_3, rating_4, rating_5] =
        getAmountRatings(temp_product_raiting);
      let { avarage, number } = getAvarage(temp_product_raiting);
      let raiting_total =
        number !== 1
          ? `Basado en ${number} valoraciones`
          : `Basado en ${number} valoración`;
      let main_opinion_html =
        main_opinion !== null
          ? `
          <div class="head">
            <div>
              <p>${main_opinion.titulo}</p>
              <p>${main_opinion.fecha.split(" ")[0]}</p>
            </div>
            <div>
              <div>${renderStarsMainOpinion(
                parseInt(main_opinion.num_stars)
              )}</div>
              <div>${main_opinion.name}</div>
            </div>
            
          </div>
          <div class="coment">
            <p>
              ${main_opinion.descripcion}
            </p>
          </div>`
          : `<p class="empty_opinion"> Se el primero en dejar tu opinión</p>`;

      //let stars_avarage = renderStarsAvarage(avarage);

      //Render Rating Data
      /* jQuery(".product_main_information_container .raiting .estrellas").html(
        stars_avarage
      ); */
      //jQuery(".product_main_information_container .raiting p").html(avarage);
      jQuery(".valor_exp_desk .average").html(avarage);
      jQuery(".valoracion .content_value h3").html(avarage);
      jQuery(".valor_exp_desk .raiting_total").html(raiting_total);
      jQuery(".valoracion .content_value p").html(raiting_total);
      jQuery(".valor_exp_desk .two .content_two").html(main_opinion_html);
      jQuery(".valor_exp_desk .quanty > div:nth-child(1)").html(`<span>1</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_1}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(2)").html(`<span>2</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_2}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(3)").html(`<span>3</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_3}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(4)").html(`<span>4</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_4}</span>`);
      jQuery(".valor_exp_desk .quanty > div:nth-child(5)").html(`<span>5</span>
      <i class="fa fa-star"></i>
      <div class="bar"></div>
      <span>${rating_5}</span>`);

      let skus = {};

      /* Chocolates */
      let query = `fq=productId:361`;
      let url = "/api/catalog_system/pub/products/search/?" + query;
      let headers = { "Content-Type": "application/json" };
      let result_sub_prod = await getRequest(url, headers);

      if (result_sub_prod.length) {
        let { items } = result_sub_prod[0];

        for (let index = 0; index < items.length; index++) {
          let { sellers, images, referenceId, itemId, kitItems } = items[index];
          let { commertialOffer, addToCartLink } = sellers[0];
          let { Price, ListPrice, AvailableQuantity } = commertialOffer;

          if (
            Price > 0 &&
            images != null &&
            images.length > 0 &&
            AvailableQuantity > 0
          ) {
            let data = {
              itemId: itemId,
              images: images,
              addToCartLink: addToCartLink,
              Price: Price,
              ListPrice: ListPrice,
              AvailableQuantity: AvailableQuantity,
              referenceId: referenceId,
            };

            let sabor = items[index].PACK[0];
            sabor = sabor.replace(/ /g, "");
            skus[sabor] = {};
            skus[sabor] = data;
          }
        }
      }

      let idx = Object.keys(skus)[0];

      /* Breadcrumb */
      let script_data = vtxctx;
      let { categoryName, departmentName } = script_data;
      let category_name = categoryName.toLowerCase();
      let department_name = departmentName.toLowerCase();

      let slide_content_galery_nav = "";
      let img_slide_single = "";
      let img_slide_single_mobile = "";

      let breadcrubs_list = "";
      let breadcrumb_mobile = "";

      if (department_name == category_name) {
        breadcrubs_list = `<li class="breadcrumb-item"> <a href="/">Home</a> </li>
				<li class="breadcrumb-item active" aria-current="page"> <a href="/${departmentName
          .toLowerCase()
          .split(" ")
          .join("-")}">${capitalizeFirstLetter(department_name)}</a> </li>`;

        breadcrumb_mobile = `<a href="/${departmentName
          .toLowerCase()
          .split(" ")
          .join("-")}"> ${capitalizeFirstLetter(departmentName)} </a>`;
      } else {
        breadcrubs_list = `<li class="breadcrumb-item"> <a href="/">Home</a> </li>
				<li class="breadcrumb-item"> <a href="/${departmentName
          .toLowerCase()
          .split(" ")
          .join("-")}">${capitalizeFirstLetter(department_name)}</a> </li>
				<li class="breadcrumb-item active" aria-current="page"> <a href="/${departmentName
          .toLowerCase()
          .split(" ")
          .join("-")}/${category_name
          .toLowerCase()
          .split(" ")
          .join("-")}"> ${capitalizeFirstLetter(category_name)} </a></li>`;

        breadcrumb_mobile = `<a href="/${departmentName
          .toLowerCase()
          .split(" ")
          .join("-")}/${category_name
          .toLowerCase()
          .split(" ")
          .join("-")}"> ${capitalizeFirstLetter(category_name)} </a>`;
      }

      jQuery(".custom_breadcrumb").html(breadcrubs_list);
      jQuery(".toback a").html(breadcrumb_mobile);

      /* Checking type product */
      jQuery(".colores_products").addClass("hide");
      jQuery(".btn_guia_tallas").addClass("hide");
      jQuery(".msg_tallas").html(`<div><p>Sabores disponibles</p></div>`);
      let options = "";

      Object.keys(flavors).forEach((key) => {
        if (skus.hasOwnProperty(key)) {
          let sku = skus[key].itemId;
          let seller = getParameterByUrl("seller", skus[idx].addToCartLink);
          let sc = getParameterByUrl("seller", skus[idx].addToCartLink);
          let selected = key == idx ? "selected" : "";

          /* options =
            options +
            `<option data-sabor="${flavors[key]}" data-sku="${sku}" data-sku-special="${item_id_perfume}"  data-seller="${seller}" data-sc="${sc}" value="${key}" ${selected}> ${flavors[key]} </option>`; */

          options =
          options +
          `<button class="button_size ${selected}" data-sabor="${flavors[key]}" data-sku="${sku}" data-sku-special="${item_id_perfume}"  data-seller="${seller}" data-sc="${sc}" value="${key}">
            <span class="talla_nombre"> ${key} </span>
            <span class="talla_sub_nombre"> ${flavors[key]} </span>
          </button>`;
        }
      });

      //jQuery("#size_product_esp").empty().append(options);
      $("#tallas_container").empty().html(options);

      if (images.length) {
        let init_idx = images.length > 1 ? 1 : 0;
        for (let index = init_idx; index < images.length; index++) {
          slide_content_galery_nav += `<div class="color_item btn_image_scroll mini-${images[index].imageId}" data-scroll-item="image-${images[index].imageId}">
            <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}" />
          </div>`;

          img_slide_single += `<div class="image-link image-${images[index].imageId}" data-mini="mini-${images[index].imageId}" data-lightbox="product-image">
            <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}"/>
          </div>`;

          img_slide_single_mobile += `<div class="image-link" data-lightbox="product-image-mobile">
            <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}"/>
          </div>`;
        }
      }

      let hasDiscount = PriceProduct == ListPriceProduct ? false : true;
      let discount = hasDiscount
        ? 100 - (PriceProduct * 100) / ListPriceProduct
        : 0;
      let price_format = parseFloat(PriceProduct)
        .toFixed(2)
        .toLocaleString("en-US");
      let list_price_format = parseFloat(ListPriceProduct)
        .toFixed(2)
        .toLocaleString("en-US");
      let discount_format = parseFloat(discount).toFixed(0);

      jQuery(".description .title h1").html(productName);
      //jQuery("#skuNumber").html(productReference);
      jQuery(".description .content_price .price").html(`S/ ${price_format}`);
      jQuery(".description .content_price .before_price").html(
        hasDiscount ? `S/ ${list_price_format}` : ""
      );
      jQuery(".description .content_price .discount").html(
        hasDiscount ? `${discount_format}% dcto.` : ""
      );

      jQuery(".texto_descripcion_desk, .texto_descripcion_mobile").html(
        `<p>${description}</p>`
      );
      $(".slide_content_galery_nav").length && jQuery(".slide_content_galery_nav").html(slide_content_galery_nav);
      $(".img_slide_single").length && jQuery(".img_slide_single").html(img_slide_single);
      $(".slider_product").length && jQuery(".slider_product").html(img_slide_single_mobile);

      jQuery(".btn-buy").attr("data-sku", skus[idx].itemId);
      jQuery(".btn-buy").attr("data-sku-special", item_id_perfume);
      jQuery(".btn-buy").attr("data-quantity", 1);
      jQuery(".btn-buy").attr(
        "data-seller",
        getParameterByUrl("seller", addToCartLink)
      );
      jQuery(".btn-buy").attr(
        "data-sc",
        getParameterByUrl("sc", addToCartLink)
      );
      jQuery(".btn-buy").attr("data-sabor", flavors[idx]);

      //jQuery('.button_ranting_modal').attr('data-product-id', productId);
      jQuery(".btn_add_favorites").attr("data-sku-id", sku_id);

      if (user_favorites != "") {
        user_favorites.skus.includes(sku_id)
          ? jQuery(".btn_add_favorites")
              .addClass("icons-renzo-costa-hearth-bg")
              .removeClass("icons-renzo-costa-hearth")
          : "";
      }

      jQuery(".info_description .property").html(description_info);

      jQuery(".info_details .composition").html(
        `<span>COMPOSICIÓN<span>${details}`
      );

      jQuery(".info_details .sizes").html(`<span>MEDIDAS<span>${sizes}`);

      /** Adding description meta pixel fb */
      og_description = description_info;
      og_description = html2string(og_description);

      jQuery("meta[property='og:description']").attr("content", og_description);

      jQuery("head").append(
        `<meta property="og:price:amount" content="${price_format}" />`
      );
      jQuery("head").append(
        `<meta property="og:price:currency" content="PEN" />`
      );
      jQuery("head").append(
        `<meta property="product:brand" content="Renzo Costa" />`
      );
      jQuery("head").append(
        `<meta property="product:availability" content="in stock"}" />`
      );
      jQuery("head").append(
        `<meta property="product:condition" content="new" />`
      );
      jQuery("head").append(
        `<meta property="product:price:amount" content="${price_format}" />`
      );
      jQuery("head").append(
        `<meta property="product:price:currency" content="PEN" />`
      );
      jQuery("head").append(
        `<meta property="product:retailer_item_id" content="${product}" />`
      );

      /** End adding description meta pixel fb*/

      setTimeout(function () {
        jQuery(".slider_product").slick({
          infinite: false,
          arrows: false,
          speed: 800,
          slidesToShow: 1,
          slidesToScroll: 1,
          asNavFor: ".slide_content_galery_nav",
        });

        jQuery(".slide_content_galery_nav")
          .on("init", function (event, slick) {
            jQuery(
              ".slide_content_galery_nav .slick-slide.slick-current"
            ).addClass("is-active");
          })
          .slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            dots: false,
            focusOnSelect: true,
            centerMode: true,
            infinite: false,
            asNavFor: ".slider_product",
          });
      }, 1000);

      //relacionado_tipo == "WP ETR-20 7553" ? "" : jQuery('.mosaico').addClass("billeteras");

      //Page loaded
      jQuery("body").addClass("loaded");

      lightbox.option({
        resizeDuration: 200,
        wrapAround: false,
        fitImagesInViewport: false,
        maxWidth: null,
        maxHeight: null,
      });
    }
  }

  jQuery("body").on("click", ".btn-buy", async function (e) {
    e.preventDefault();

    let btn = jQuery(this);
    let id = btn.attr("data-sku");
    let sku_special_id = btn.attr("data-sku-special");
    let quantity = btn.attr("data-quantity");
    let seller = btn.attr("data-seller");
    let sc = btn.attr("data-sc");
    let color = btn.attr("data-color");
    let size = btn.attr("data-size");
    let sabor = btn.attr("data-sabor");

    btn.addClass("btn-loading");
    jQuery(".bag").removeClass("added");

    if (sku_special_id != null && sku_special_id != undefined) {
      updateSessionSkuCard(id, color, size);
      updateSessionSkuCard(sku_special_id, color, size, sabor);
    } else {
      updateSessionSkuCard(id, color, size, sabor);
    }

    if (id != "" && quantity != "" && seller != "" && sc != "") {
      let item = {
        id,
        quantity,
        seller,
      };

      let items = [];
      items.push(item);

      if (sku_special_id != null && sku_special_id != undefined) {
        items.push({ id: sku_special_id, quantity, seller });
      }

      vtexjs.checkout
        .getOrderForm()
        .then(function (orderForm) {
          return vtexjs.checkout.addToCart(items, null, sc);
        })
        .done(function (orderForm) {
          jQuery(".bag .cant").html(orderForm.items.length);
          jQuery(".bag").addClass("added");
          btn.removeClass("btn-loading");
        });
    }
  });

    //jQuery("body").on("change", "#size_product_esp", async function (e) {
    jQuery(".tallas_container button").on("click", async function (e) {
    //let option = jQuery(this).children("option:selected");
    let option = jQuery(this);
    jQuery(".tallas_container button").removeClass("selected");
    option.addClass("selected");

    let id = option.attr("data-sku");
    let seller = option.attr("data-seller");
    let sc = option.attr("data-sc");
    let color = option.attr("data-color");
    let size = option.attr("data-size");
    let sabor = option.attr("data-sabor");
    let quantity = option.attr("data-quantity");
    let price = option.attr("data-price");

    jQuery(".btn-buy").attr("data-sku", id);
    jQuery(".btn-buy").attr("data-seller", seller);
    jQuery(".btn-buy").attr("data-sc", sc);
    jQuery(".btn-buy").attr("data-color", color);
    jQuery(".btn-buy").attr("data-size", size);
    jQuery(".btn-buy").attr("data-sabor", sabor);

    quantity == 0
      ? jQuery(".btn-buy").attr("disabled", "disabled")
      : jQuery(".btn-buy").removeAttr("disabled");

    quantity == 0
      ? jQuery(".btn-buy").text("Agotado")
      : jQuery(".btn-buy").text("Agregar al carrito");

    quantity == 0
      ? jQuery(".btn_container .notifyme-form p").text(
          "Déjanos tu nombre y correo. Te avisaremos cuando el producto este disponible."
        )
      : jQuery(".btn_container .notifyme-form p").text("");

    quantity == 0
      ? jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).attr("placeholder", "Ingrese Correo")
      : jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).attr("placeholder", "");

    quantity == 0
      ? jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).val("renzocosta")
      : jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).val("");

    quantity == 0
      ? jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientEmail"]'
        ).attr("placeholder", "Ingrese Correo")
      : jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientEmail"]'
        ).attr("placeholder", "");

    quantity == 0
      ? jQuery('.btn_container .notifyme-form input[type="button"]').val(
          "Notificar"
        )
      : jQuery('.btn_container .notifyme-form input[type="button"]').val("");

    quantity == 0
      ? jQuery(".btn_container fieldset .notifyme-success").text(
          "Notificación exitosa, le enviaremos un correo electrónico cuando el producto este disponible."
        )
      : jQuery(".btn_container fieldset .notifyme-success").text("");

    quantity == 0
      ? jQuery(".btn_container").addClass("hide")
      : jQuery(".btn_container").addClass("hide");

    jQuery(".description .content_price .price").html(`S/ ${price}`);
  });

  jQuery("body").on("click", ".button_ranting_modal", function (e) {
    e.preventDefault();

    let user_id = profile.hasOwnProperty("UserId") ? profile.UserId : null;

    if (user_id) {
      let button = jQuery(this);
      let product_id = button.attr("data-product-id");

      jQuery('.rating_form input[name="product_id"]').val(product_id);
      jQuery("#opinion_modal").modal("show");
    } else {
      document.getElementById("login").click();
    }
  });

  jQuery(".btn_rating_star").on("click", function (e) {
    e.preventDefault();

    let button = jQuery(this);
    let parent = button.parent();
    let rating_value = parent.attr("data-valor");
    let hasActive = parent.hasClass("active");

    jQuery(".rating_input_group > span").removeClass("active");

    hasActive ? parent.removeClass("active") : parent.addClass("active");

    hasActive
      ? jQuery('.rating_form input[name="rating"]').val("")
      : jQuery('.rating_form input[name="rating"]').val(rating_value);
  });

  jQuery("body").on("click", ".raiting .estrellas label", function (e) {
    e.preventDefault();

    let user_id = profile.hasOwnProperty("UserId") ? profile.UserId : null;

    if (user_id) {
      let button = jQuery(this);
      let product_id = button.attr("data-product-id");

      jQuery('.rating_form input[name="product_id"]').val(product_id);
      jQuery("#opinion_modal").modal("show");
    } else {
      document.getElementById("login").click();
    }
  });

  jQuery(".rating_form").validate(ratingValidation);

  jQuery("body").on("click", ".btn_add_rating_opinion", async function (e) {
    e.preventDefault();

    let button = jQuery(this);

    const form = jQuery(".rating_form");
    const isValid = form.valid();

    if (isValid) {
      button.addClass("btn-loading");

      const acronym = "OP";

      let product_id = jQuery('.rating_form input[name="product_id"]').val();
      let rating = jQuery('.rating_form input[name="rating"]').val();
      let title = jQuery('.rating_form input[name="rating_title"]').val();
      let text_opinion = jQuery(
        '.rating_form textarea[name="rating_opinion"]'
      ).val();

      let user_name = profile.hasOwnProperty("UserId")
        ? getFullName(profile.FirstName, profile.LastName)
        : "";

      let opinion_url = "";
      let opinion_response = null;
      let temp_ratings = await getProductRating(product_id);
      let ratings =
        temp_ratings === ""
          ? deafultRatingsData(rating, product_id)
          : temp_ratings;

      let { opiniones } = ratings;
      let [date, time] = new Date().toLocaleString("es-PE").split(", ");

      let opinion = {
        titulo: title,
        descripcion: text_opinion,
        fecha: date,
        num_stars: rating,
        name: user_name,
      };

      opiniones.push(opinion);

      if (opiniones.length > 1) {
        let new_rating = updateRatingData(ratings, rating, opiniones);

        opinion_url = `api/dataentities/${acronym}/documents/${product_id}`;

        opinion_response = await patchRequest(
          opinion_url,
          masterDataRequestHeader,
          JSON.stringify(new_rating)
        );
      } else {
        opinion_url = `api/dataentities/${acronym}/documents/`;

        opinion_response = await putRequest(
          opinion_url,
          masterDataRequestHeader,
          JSON.stringify(ratings)
        );
      }

      button.removeClass("btn-loading");

      jQuery("#opinion_modal").modal("hide");
    }
  });

  jQuery("body").on("click", ".btn_add_favorites", async function (e) {
    e.preventDefault();

    let notLogin = jQuery(".btnFavorites").hasClass("login-click");
    let favorite_response = {};

    if (notLogin) {
      jQuery("#ajaxBusy").remove();
      document.getElementById("login").click();
    } else {
      let button = jQuery(this);
      let isFavorite = button.hasClass("icons-renzo-costa-hearth-bg");
      let skuId = button.attr("data-sku-id");
      let favorite_data_send = {};
      let favorite_url = "";

      let user_id = profile.hasOwnProperty("UserId") ? profile.UserId : null;
      const acronym = "FV";
      const id = user_id;
      const get_favorites_url = `api/dataentities/${acronym}/documents/${id}?_fields=skus`;
      const favorites = await getRequest(
        get_favorites_url,
        masterDataRequestHeader
      );

      if (favorites == "") {
        favorite_url = `api/dataentities/${acronym}/documents/`;
        favorite_data_send = {
          id,
          skus: [skuId],
        };

        favorite_response = await putRequest(
          favorite_url,
          masterDataRequestHeader,
          JSON.stringify(favorite_data_send)
        );
      } else {
        let { skus } = favorites;

        if (isFavorite) {
          let new_skus = skus.filter((sku) => sku !== skuId);
          favorite_url = `api/dataentities/${acronym}/documents/${id}`;
          favorite_data_send = {
            //id,
            skus: new_skus,
          };
        } else {
          let new_skus = [...skus, skuId];
          favorite_url = `api/dataentities/${acronym}/documents/${id}`;
          favorite_data_send = {
            //id,
            skus: new_skus,
          };
        }

        favorite_response = await patchRequest(
          favorite_url,
          masterDataRequestHeader,
          JSON.stringify(favorite_data_send)
        );
      }

      //if (favorite_response.hasOwnProperty('Id')) {
      isFavorite
        ? button
            .removeClass("icons-renzo-costa-hearth-bg")
            .addClass("icons-renzo-costa-hearth")
        : button
            .addClass("icons-renzo-costa-hearth-bg")
            .removeClass("icons-renzo-costa-hearth");
      //}
    }
  });
  console.log("furrararaarr");
  jQuery("body").on("click", ".btn_change_sku", async function (e) {
    e.preventDefault();
    //Make a loaded effect
    //jQuery('body').removeClass("loaded");

    let btn = jQuery(this);
    console.log("se da click imagen",btn)
    let productId = btn.attr("data-productId");
    let itemId = btn.attr("data-sku-id");
    let productName = btn.attr("data-productName");
    let referenceId = btn.attr("data-referenceId");
    let Price = btn.attr("data-Price");
    let ListPrice = btn.attr("data-ListPrice");
    let description = btn.attr("data-description");
    let url = btn.attr("data-url");
    let linktext = btn.attr("data-linkText");
    let seller = btn.attr("data-seller");
    let sc = btn.attr("data-sc");
    let color = btn.attr("data-color");
    let images = JSON.parse(btn.attr("data-imgs"));
    let AvailableQuantity = btn.attr("data-available");
    let detalles = btn.attr("data-details");

    let slide_content_galery_nav = "";
    let img_slide_single = "";
    let img_slide_single_mobile = "";

    if (jQuery(".img_slide_single").hasClass("slick-initialized")) {
      jQuery(".img_slide_single").slick("destroy");
    }

    if (jQuery(".slide_content_galery_nav").hasClass("slick-initialized")) {
      jQuery(".slide_content_galery_nav").slick("destroy");
    }

    jQuery(".slider_product").html("");
    jQuery(".img_slide_single").html("");

    user_favorites = await getUserFavorites(profile);

    if (user_favorites != "") {
      user_favorites.skus.includes(itemId)
        ? jQuery(".btn_add_favorites")
            .addClass("icons-renzo-costa-hearth-bg")
            .removeClass("icons-renzo-costa-hearth")
        : jQuery(".btn_add_favorites")
            .removeClass("icons-renzo-costa-hearth-bg")
            .addClass("icons-renzo-costa-hearth");
    } else {
      jQuery(".btn_add_favorites")
        .removeClass("icons-renzo-costa-hearth-bg")
        .addClass("icons-renzo-costa-hearth");
    }

    if (images.length) {
      let init_idx = images.length > 1 ? 1 : 0;
      for (let index = init_idx; index < images.length; index++) {
        slide_content_galery_nav += `<div class="color_item btn_image_scroll mini-${images[index].imageId}" data-scroll-item="image-${images[index].imageId}">
          <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}" />
        </div>`;

        img_slide_single += `<div class="image-link image-${images[index].imageId}" data-mini="mini-${images[index].imageId}" data-lightbox="product-image">
          <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}"/>
        </div>`;

        img_slide_single_mobile += `<div class="image-link" data-lightbox="product-image-mobile">
          <img src="${images[index].imageUrl}" alt="${images[index].imageLabel}"/>
        </div>`;
      }
    }

    let hasDiscount = Price == ListPrice ? false : true;
    let discount = hasDiscount ? 100 - (Price * 100) / ListPrice : 0;
    let price_format = parseFloat(Price).toFixed(2).toLocaleString("en-US");
    let list_price_format = parseFloat(ListPrice)
      .toFixed(2)
      .toLocaleString("en-US");
    let discount_format = parseFloat(discount).toFixed(0);

    jQuery(".description .title h1").html(productName);
    //jQuery("#skuNumber").html(referenceId);
    jQuery(".description .content_price .price").html(`S/ ${price_format}`);
    jQuery(".description .content_price .before_price").html(
      hasDiscount ? `S/ ${list_price_format}` : ""
    );
    jQuery(".description .content_price .discount").html(
      hasDiscount ? `${discount_format}% dcto.` : ""
    );

    jQuery(".info_details .composition").html(`
        <div class="composition_row">
          <span>
            SKU: ${referenceId}
            <span>
              <p>${description}</p>
            </span>
          </span> 
        </div>
        <div class="composition_row">
          <span>
            COMPOSICIÓN
            <span>${detalles}</span> 
          </span>   
        </div>
      `);
    jQuery(".texto_descripcion_desk, .texto_descripcion_mobile").html(
      `<p>${description}</p>`
    );
    $(".slide_content_galery_nav").length && jQuery(".slide_content_galery_nav").html(slide_content_galery_nav);
    $(".img_slide_single").length && jQuery(".img_slide_single").html(img_slide_single);
    $(".slider_product").length && jQuery(".slider_product").html(img_slide_single_mobile);

    jQuery(".breadProduct").attr("href", "");
    jQuery(".breadProduct").text("");
    jQuery(".breadProduct").attr("href", linktext);
    jQuery(".breadProduct").text(
      productName.toLowerCase().split(" ").join("-")
    );
    jQuery(".copyText").attr("data-link", url);

    jQuery(".btn-buy").attr("data-sku", itemId);
    jQuery(".btn-buy").attr("data-quantity", 1);
    jQuery(".btn-buy").attr("data-seller", seller);
    jQuery(".btn-buy").attr("data-sc", sc);
    jQuery(".btn-buy").attr("data-color", color);
    jQuery(".btn-buy").attr("data-size", "");

    jQuery(".button_ranting_modal").attr("data-product-id", productId);
    jQuery(".btn_add_favorites").attr("data-sku-id", itemId);
    jQuery(
      ".btn_container .portal-notify-me-ref .notifyme-form .sku-notifyme-skuid"
    ).val(itemId);

    //Check stock
    AvailableQuantity > 0
      ? jQuery(".btn-buy").removeAttr("disabled")
      : jQuery(".btn-buy").attr("disabled", "disabled");

    AvailableQuantity > 0
      ? jQuery(".btn-buy").text("Agregar al carrito")
      : jQuery(".btn-buy").text("Agotado");

    AvailableQuantity > 0
      ? jQuery(".btn_container .notifyme-form p").text("")
      : jQuery(".btn_container .notifyme-form p").text(
          "Déjanos tu nombre y correo. Te avisaremos cuando el producto este disponible."
        );

    AvailableQuantity > 0
      ? jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).attr("placeholder", "")
      : jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).attr("placeholder", "Ingrese Correo");

    AvailableQuantity > 0
      ? jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).val("renzocosta")
      : jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientName"]'
        ).val("");

    AvailableQuantity > 0
      ? jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientEmail"]'
        ).attr("placeholder", "")
      : jQuery(
          '.btn_container .notifyme-form input[name="notifymeClientEmail"]'
        ).attr("placeholder", "Ingrese Correo");

    AvailableQuantity > 0
      ? jQuery('.btn_container .notifyme-form input[type="button"]').val("")
      : jQuery('.btn_container .notifyme-form input[type="button"]').val(
          "Notificar"
        );

    AvailableQuantity > 0
      ? jQuery(".btn_container fieldset .notifyme-success").text("")
      : jQuery(".btn_container fieldset .notifyme-success").text(
          "Notificación exitosa, le enviaremos un correo electrónico cuando el producto este disponible."
        );

    AvailableQuantity > 0
      ? jQuery(".btn_container").addClass("hide")
      : jQuery(".btn_container").removeClass("hide");

    let colors = jQuery(".colores_products .color_item__circle");

    jQuery.each(colors, function (index, value) {
      jQuery(value).removeClass("active");
    });

    btn.find(".color_item__circle").addClass("active");

    history.pushState(null, "", url);

    setTimeout(function () {
      jQuery(".img_slide_single").slick({
        infinite: false,
        arrows: false,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: ".slide_content_galery_nav",
      });

      jQuery(".slide_content_galery_nav")
        .on("init", function (event, slick) {
          jQuery(
            ".slide_content_galery_nav .slick-slide.slick-current"
          ).addClass("is-active");
        })
        .slick({
          slidesToShow: 5,
          slidesToScroll: 1,
          dots: false,
          focusOnSelect: false,
          infinite: false,
          asNavFor: ".img_slide_single",
        });
    }, 1000);

    lightbox.option({
      resizeDuration: 200,
      wrapAround: false,
      fitImagesInViewport: false,
      maxWidth: null,
      maxHeight: null,
    });
    // window.location.reload();
    requestProduct(productId);
  });

  jQuery("body").on(
    "click",
    ".product_detail_block .information_title",
    function (e) {
      e.preventDefault();

      let button = jQuery(this);
      let parent = button.parent();
      let uncles = parent.siblings();

      parent.toggleClass("active");
      uncles.removeClass("active");
    }
  );

  jQuery(".btn_guia_tallas").on("click", function () {
    jQuery(".guia_tallas_modal").modal("show");
  });

  jQuery("body").on("click", ".icons-renzo-costa-share", function (e) {
    e.preventDefault();
    let $temp = $("<input>");
    let url = window.location.href;
    $("body").append($temp);
    $temp.val(url).select();
    document.execCommand("copy");
    $temp.remove();
  });

  jQuery("body").on("click", ".btn_image_scroll", function (e) {
    e.preventDefault();

    let button = jQuery(this);
    let index = button.attr("data-slick-index");
    let siblings = button.siblings(".btn_image_scroll");

    button.addClass("slick-current is-active");
    siblings.removeClass("slick-current is-active");

    jQuery(".img_slide_single").slick("goTo", parseInt(index, 10));

    /* let selector_item_to_scroll = `.${button.attr("data-scroll-item")}`;

    jQuery("html, body").animate(
      {
        scrollTop: jQuery(selector_item_to_scroll).offset().top - 180,
      },
      350
    ); */
  });

  /* jQuery("body").on("click", ".arrowUp_pd", function () {
    let current = jQuery(".btn_image_scroll.slick-current.is-active");
    let siblings = current.siblings(".btn_image_scroll");
    let before = current.prev(".btn_image_scroll");
    let selector_item_to_scroll = `.${before.attr("data-scroll-item")}`;

    current.removeClass("slick-current is-active");
    siblings.removeClass("slick-current is-active");
    before.addClass("slick-current is-active");

    jQuery("html, body").animate(
      {
        scrollTop: jQuery(selector_item_to_scroll).offset().top - 10,
      },
      2000
    );
  }); */

  /* jQuery("body").on("click", ".arrowDown_pd", function () {
    let current = jQuery(".btn_image_scroll.slick-current.is-active");
    let siblings = current.siblings(".btn_image_scroll");
    let after = current.next(".btn_image_scroll");
    let selector_item_to_scroll = `.${after.attr("data-scroll-item")}`;

    current.removeClass("slick-current is-active");
    siblings.removeClass("slick-current is-active");
    after.addClass("slick-current is-active");

    jQuery("html, body").animate(
      {
        scrollTop: jQuery(selector_item_to_scroll).offset().top - 10,
      },
      2000
    );
  }); */

  jQuery(document).on("scroll", function (e) {
    if (!is_mobile) {
      let scroll = jQuery(this).scrollTop();
      let { top, height } = document
        .querySelector("body .img_slide_single")
        .getBoundingClientRect();
      let main_images = document.querySelectorAll(
        "body .img_slide_single .image-link"
      );

      main_images.forEach((element) => {
        let element_top = element.offsetTop;

        if (scroll >= element_top) {
          let selector_item_mini = element.getAttribute("data-mini");
          let all_items_mini = document.querySelectorAll(`.btn_image_scroll`);
          let item_mini_element = document.querySelector(
            `.${selector_item_mini}`
          );

          all_items_mini.forEach((item) => {
            item.classList.remove("slick-current", "is-active");
          });

          item_mini_element.classList.add("slick-current", "is-active");
        }
      });

      if (top < 0) {
        if (Math.abs(top) + document.documentElement.clientHeight >= height) {
          document
            .querySelector(
              ".content_slider_product_details .miniature_container"
            )
            .classList.add("bottom");
          document
            .querySelector(
              ".content_slider_product_details .miniature_container"
            )
            .classList.remove("sticky");

          document
            .querySelector(".card_mobile .product_main_information_container")
            .classList.add("bottom");
          document
            .querySelector(".card_mobile .product_main_information_container")
            .classList.remove("sticky");
        } else {
          document
            .querySelector(
              ".content_slider_product_details .miniature_container"
            )
            .classList.remove("bottom");
          document
            .querySelector(
              ".content_slider_product_details .miniature_container"
            )
            .classList.add("sticky");

          document
            .querySelector(".card_mobile .product_main_information_container")
            .classList.remove("bottom");
          document
            .querySelector(".card_mobile .product_main_information_container")
            .classList.add("sticky");
        }
      } else {
        document
          .querySelector(".content_slider_product_details .miniature_container")
          .classList.remove("bottom", "sticky");

        document
          .querySelector(".card_mobile .product_main_information_container")
          .classList.remove("bottom", "sticky");
      }
    }
  });

  jQuery(".copyText").on("click", function () {
    let texto = jQuery(this).attr("data-link");
    shareLink(texto);
  });
});
