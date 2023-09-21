function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const itemsCatalog = new Map();

const getLiItem = (itemId, text) => {
  return `
  <div
    class="li-item"
    id="${itemId}"
  >
    <div
      class="subtitle"
    >${text}</div>
    <img
      class="li-icon"
      id="interoperableCheckId"
      src="./resources/img/check.png"
      alt="logo"
    />
  </div>
`;
};

itemsCatalog.set(
  "no-vaccination-standard-item",
  getLiItem("no-vaccination-standard-item", "No vaccination standard")
);

itemsCatalog.set(
  "who-ddcc-standard-item",
  getLiItem("who-ddcc-standard-item", "WHO DDCC standard")
);

itemsCatalog.set(
  "divoc-standard-item",
  getLiItem("divoc-standard-item", "DIVOC standard")
);

itemsCatalog.set(
  "smart-health-card-standard-item",
  getLiItem("smart-health-card-standard-item", "Smart Health Card standard")
);

itemsCatalog.set("eu-dcc-item", getLiItem("eu-dcc-item", "EU DCC standard"));

itemsCatalog.set(
  "national-interoperability-item",
  getLiItem("national-interoperability-item", "Only national interoperability")
);

const items = [
  "no-vaccination-standard-item",
  "who-ddcc-standard-item",
  "divoc-standard-item",
  "smart-health-card-standard-item",
  "eu-dcc-item",
  "national-interoperability-item",
];

window.onload = function () {
  $.i18n().load({
    en: {
      next: "Next ›",
      back: "‹ Back",
      start: "Start over",
      letsgo: "Let’s go global!",
      text1:
        "For everyone to speak the same language, we need to adopt WHO DDCC Standard",
      question: "Do you want to learn how to meet DDCC standard?",
      text2:
        "Join the LACPASS project and work with the PAHO/IDB team to support your country to raise the bar of the region and move towards the International Patient Summary",
      text3:
        "Now… how would you hold and manage all these credentials and health data?",
      text4: "Scan this QR code & play with the LACPass Digital Wallet",
      interoperability: "Your certificate has interoperability with:",
      none: "No vaccination standard",
      who_dcc: "WHO DDCC standard",
      divoc: "DIVOC standard",
      shc: "Smart Health Card standard",
      eu_dcc: "EU DCC standard",
      national: "National interoperability",
      nameLabel: "Name",
      dateOfBirthLabel: "Date of birth",
      sexLabel: "Sex",
      documentNumberLabel: "Doc. Number",
      vaccinationDetailsLabel: "Vaccination",
      certificateIdentifierLabel: "Certificate Identifier",
      certificateIssuerLabel: "Issuer",
      vaccineDetailsLabel: "Vaccine",
      productNameLabel: "Product Name",
      atcCodeLabel: "ATC Code",
      vaccinationCentreLabel: "Vaccination Centre",
      numberOfDosesLabel: "Number of Doses",
      dateOfVaccinationLabel: "Date of vaccination",
      batchNumberLabel: "Batch Number",
      identificationDataLabel: "Identification",
      viewDetailsText: "View Details",
      validCertificate: "Valid Certificate",
      invalidCertificate: "Invalid Certificate",
      countryLabel: "Country",
    },
    es: {
      next: "Siguiente ›",
      back: "‹ Atrás",
      start: "Volver al principio",
      letsgo: "¡Integrémonos!",
      text1:
        "Para que todos hablemos el mismo idioma, debemos adoptar el estándar DDCC de la OMS.",
      question: "¿Cómo nos integramos todos los países con el estándar DDCC?",
      text2:
        "Uniéndonos al proyecto LACPASS y trabajando con el equipo técnico OMS/BID.",
      text3:
        "Ahora… ¿cómo mantendría y administraría todas estas credenciales y datos de salud?",
      text4:
        "Escanea este código QR y juega con la billetera digital de LACPass",
      interoperability: "Su certificado tiene interoperabilidad con:",
      none: "Ningún estándar de vacunación",
      who_dcc: "Estándar DDCC de la OMS",
      divoc: "Estándar DIVOC",
      shc: "Estándar Smart Health Card",
      eu_dcc: "Estándar EU DCC",
      national: "Interoperabilidad nacional",
      nameLabel: "Nombre",
      dateOfBirthLabel: "Fecha de nac.",
      sexLabel: "Sexo",
      documentNumberLabel: "Nº de doc.",
      vaccinationDetailsLabel: "Vacunación",
      certificateIdentifierLabel: "Id. del certificado",
      certificateIssuerLabel: "Emisor",
      vaccineDetailsLabel: "Vacuna",
      productNameLabel: "Nombre del producto",
      atcCodeLabel: "ATC Code",
      vaccinationCentreLabel: "Centro de Vacunación",
      numberOfDosesLabel: "Número de dosis",
      dateOfVaccinationLabel: "Fecha de vacunación",
      batchNumberLabel: "Número de Lote",
      identificationDataLabel: "Identificación",
      viewDetailsText: "Ver Detalles",
      validCertificate: "Certificado Válido",
      invalidCertificate: "Certificado Inválido",
      countryLabel: "País",
    },
  });

  var lastResult,
    countResults = 0;
  function renderResults(decodedText) {
    let compatibility = "";
    if (
      decodedText.startsWith("HC1:") ||
      decodedText.startsWith("https://sso.panamadigital.gob.pa") ||
      decodedText.startsWith("https://carnetdigital.mspbs.gov.py")
    )
      compatibility = "WHO-DCC";

    if (
      decodedText.startsWith(
        "https://apisalud.msal.gob.ar/carnetCovid/v2/miArgentina/covid/carnet/validar/img?token="
      ) ||
      decodedText.startsWith("https://c19.cl:8081/?a=") ||
      decodedText.startsWith("https://scanmevacuno.gob.cl") ||
      decodedText.startsWith(
        "https://registrovacunacovid.mspas.gob.gt:2096/vacunacion/api/cc/"
      ) ||
      decodedText.startsWith("https://mavelsa.com/resultados/?q=")
    )
      compatibility = "National";

    if (
      decodedText.startsWith("PK") &&
      decodedText.indexOf("certificate.json") > 0
    )
      compatibility = "DIVOC";

    if (decodedText.startsWith("shc:/")) compatibility = "SHC";

    try {
      const jwt = parseJwt(decodedText);
      if (jwt._TOKEN_TYPE_CLAIM_ === "CertVacCovid19")
        compatibility = "National";
    } catch (e) {}

    $("#eu-dcc").prop("checked", false);
    $("#national").prop("checked", false);
    $("#shc").prop("checked", false);
    $("#none").prop("checked", false);
    $("#divoc").prop("checked", false);

    document.getElementById("viewDetailsBtnId").style.display = "none";

    removeStandardItems(items);
    const certificateTypesContainer =
      document.getElementById("certificateTypesId");
    itemsCatalog.forEach((value) => {
      const node = document.createElement("li");
      node.innerHTML = value;
      certificateTypesContainer.appendChild(node);
    });

    let itemsToRemove = [];
    document.getElementById("step2MapId").src = "mapa.jpg";

    switch (compatibility) {
      case "DIVOC":
        $("#divoc").prop("checked", true);
        $("#national").prop("checked", true);
        itemsToRemove = items.filter((item) => item !== "divoc-standard-item");
        break;
      case "WHO-DCC":
        document.getElementById("step2MapId").src = "mapa2.jpg";
        $("#who-dcc").prop("checked", true);
        itemsToRemove = items.filter(
          (item) => item !== "who-ddcc-standard-item"
        );
        callApi(decodedText);
        break;
      case "National":
        $("#national").prop("checked", true);
        itemsToRemove = items.filter(
          (item) => item !== "national-interoperability-item"
        );
        break;
      case "SHC":
        $("#shc").prop("checked", true);
        $("#national").prop("checked", true);
        itemsToRemove = items.filter(
          (item) => item !== "smart-health-card-standard-item"
        );
        break;
      default:
        $("#none").prop("checked", true);
        itemsToRemove = items;
        document.getElementById("loadingId").style.display = "none";
        document.getElementById("interoperabilityMessageId").innerHTML =
          "Unsupported/No soportado"; // TODO: improve
        break;
    }

    removeStandardItems(itemsToRemove);
    $("#step1").removeClass("showx").addClass("hide");
    $("#result").addClass("showx").show();
  }

  function removeStandardItems(itemsToRemove) {
    itemsToRemove.map((item) => {
      var element = document.getElementById(item);
      if (element && element.parentNode)
        element.parentNode.removeChild(element);
    });
  }

  function callApi(payload) {
    document.getElementById("viewDetailsBtnId").style.display = "none";
    document.getElementById("loadingId").style.display = "inline-block";
    app.client.request(
      undefined,
      "/certificates/verify-b45",
      "POST",
      undefined,
      payload,
      (newStatusCode, newResponsePayload) => {
        //display the error on the form if needed
        if (newStatusCode !== 200) {
          console.log("error response", newResponsePayload);
          setErrorModal();
          document.getElementById("interoperabilityMessageId").style.display =
            "none";
          removeStandardItems(items);
          document.getElementById("errorUuid").innerHTML =
            newResponsePayload.trace_id ? newResponsePayload.trace_id : "";
        } else if (newResponsePayload) {
          setFields(newResponsePayload);
          setWhoDDCCModal();
          document.getElementById("viewDetailsBtnId").style.display =
            "inline-block";
        } else {
          setErrorModal();
          document.getElementById("interoperabilityMessageId").style.display =
            "none";
          removeStandardItems(items);
          document.getElementById("errorIdContainerId").style.display = "none";
        }
        document.getElementById("loadingId").style.display = "none";
      }
    );
  }
  function setErrorModal() {
    /**render modal */
    // Get the modal
    const modal = document.getElementById("errorModalId");
    const buttonToClose = document.getElementById("closeErrorModalAnchorId");
    buttonToClose.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    /**activate modal */
    modal.style.display = "block";
  }
  function setFields(parsedResponse) {
    const { data } = parsedResponse;
    if (!data) {
      // TODO: show error message
    }
    const { isValid, ddccCoreDataSet } = data;
    if (!isValid) {
      $("#who-dcc").prop("checked", false);
      document.getElementById("isValidCertificateId").src =
        "./resources/img/alert.png";
      document.getElementById("invalidCertificateTextId").style.display =
        "inline-block";
      document.getElementById("validCertificateTextId").style.display = "none";
      document.getElementById("invalidCertificateMainId").style.display =
        "flex";
      document.getElementById("interoperableCheckId").style.display = "none";
    } else {
      document.getElementById("isValidCertificateId").src =
        "./resources/img/check.png";
      document.getElementById("invalidCertificateTextId").style.display =
        "none";
      document.getElementById("validCertificateTextId").style.display =
        "inline-block";
      document.getElementById("invalidCertificateMainId").style.display =
        "none";
      document.getElementById("interoperableCheckId").style.display =
        "inline-block";
    }

    const {
      birthDate,
      certificate,
      identifier,
      name,
      // resourceType,
      sex,
      vaccination,
    } = ddccCoreDataSet;

    const { hcid, issuer } = certificate;
    if (!hcid || !issuer) {
      // TODO: show error message
    }
    const { value } = hcid;
    if (!value) {
      // TODO: show error message
    }
    const issuerIdentifierValue =
      issuer.identifier && issuer.identifier.value
        ? issuer.identifier.value
        : null;
    if (!issuerIdentifierValue) {
      // TODO: show error message
    }
    const { brand, centre, country, date, dose, lot, vaccine } = vaccination;
    const brandCode = brand && brand.code ? brand.code : null;
    if (!brandCode) {
      // TODO: show error message
    }
    const countryCode = country && country.code ? country.code : null;
    if (!countryCode) {
      // TODO: show error message
    }
    const vaccineCode = vaccine && vaccine.code ? vaccine.code : null;
    if (!vaccineCode) {
      // TODO: show error message
    }

    document.getElementById("patientNameId").innerHTML = name;
    document.getElementById("dateOfBirthId").innerHTML = birthDate;
    document.getElementById("genderId").innerHTML = sex;
    document.getElementById("documentNumberId").innerHTML = identifier;
    document.getElementById("certificateIdentifierId").innerHTML = value;
    document.getElementById("certificateIssuerId").innerHTML =
      issuerIdentifierValue;
    const mappedBrandCode = MEDICINAL_PRODUCT_NAMES.get(brandCode);
    document.getElementById("brandCodeId").innerHTML = mappedBrandCode
      ? mappedBrandCode
      : brandCode;
    document.getElementById("atcCodeId").innerHTML = vaccineCode;
    document.getElementById("vaccinationCentreId").innerHTML = centre;
    document.getElementById("numberOfDosesId").innerHTML = dose;
    document.getElementById("dateOfVaccinationId").innerHTML = date;
    document.getElementById("batchId").innerHTML = lot;
    document.getElementById("countryId").innerHTML = alpha2CountryCodes.get(
      countryCode
    )
      ? alpha2CountryCodes.get(countryCode)
      : countryCode;
  }

  function setWhoDDCCModal() {
    /**render modal */
    // Get the modal
    const modal = document.getElementById("verificationResultModalId");

    // Get the button that opens the modal
    const btn = document.getElementById("viewDetailsBtnId");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function () {
      modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    /**activate modal */
    modal.style.display = "block";
  }

  function onScanSuccess(decodedText, _decodedResult) {
    if (html5QrcodeScanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
      // Add this check to ensure success callback is not being called
      // from file based scanner.

      // Pause on scan result
      html5QrcodeScanner.pause();
    }

    if (decodedText !== lastResult) {
      console.log("decoded Text", decodedText);
      ++countResults;
      lastResult = decodedText;

      renderResults(decodedText);
    }
  }

  // Optional callback for error, can be ignored.
  function onScanError(qrCodeError) {}

  var qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
    // Square QR Box, with size = 80% of the min edge.
    var minEdgeSizeThreshold = 250;
    var edgeSizePercentage = 0.75;
    var minEdgeSize =
      viewfinderWidth > viewfinderHeight ? viewfinderHeight : viewfinderWidth;
    var qrboxEdgeSize = Math.floor(minEdgeSize * edgeSizePercentage);
    if (qrboxEdgeSize < minEdgeSizeThreshold) {
      if (minEdgeSize < minEdgeSizeThreshold) {
        return { width: minEdgeSize, height: minEdgeSize };
      } else {
        return {
          width: minEdgeSizeThreshold,
          height: minEdgeSizeThreshold,
        };
      }
    }
    return { width: qrboxEdgeSize, height: qrboxEdgeSize };
  };

  function initializeQrCodeScanner() {
    html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: qrboxFunction,
      rememberLastUsedCamera: false,
    });
    html5QrcodeScanner.render(onScanSuccess, onScanError);
  }

  let html5QrcodeScanner;
  initializeQrCodeScanner();

  $("#button1").click(function () {
    $("#result").removeClass("showx").addClass("hide");
    $("#step2").addClass("showx").show();
    $(window).scrollTop(0);
  });
  $("#button1b").click(function () {
    html5QrcodeScanner.clear().then(() => {
      initializeQrCodeScanner();
    });
    $("#result").removeClass("showx").addClass("hide");
    $("#step1").removeClass("hide").addClass("showx").show();
    lastResult = "";
    $(window).scrollTop(0);
  });

  $("#button2").click(function () {
    $("#step2").removeClass("showx").addClass("hide");
    $("#step3").addClass("showx").show();
    $(window).scrollTop(0);
  });
  $("#button2b").click(function () {
    $("#step2").removeClass("showx").addClass("hide");
    $("#result").removeClass("hide").addClass("showx").show();
    $(window).scrollTop(0);
  });

  $("#button3").click(function () {
    $("#step3").removeClass("showx").addClass("hide");
    $("#step4").addClass("showx").show();
    $(window).scrollTop(0);
  });
  $("#button3b").click(function () {
    $("#step3").removeClass("showx").addClass("hide");
    $("#step2").removeClass("hide").addClass("showx").show();
    $(window).scrollTop(0);
  });

  $("#button4").click(function () {
    $("#step4").removeClass("showx").addClass("hide");
    $("#step5").addClass("showx").show();
    $(window).scrollTop(0);
  });
  $("#button4b").click(function () {
    $("#step4").removeClass("showx").addClass("hide");
    $("#step3").removeClass("hide").addClass("showx").show();
    $(window).scrollTop(0);
  });

  $("#button5").click(function () {
    html5QrcodeScanner.clear().then(() => {
      initializeQrCodeScanner();
    });
    $("#step3").removeClass("showx").addClass("hide");
    $("#step1").addClass("showx").show();
    lastResult = "";
    $(window).scrollTop(0);
  });

  $("body").i18n();

  $("#lang").change(function () {
    const lang = $(this).val();
    $.i18n().locale = lang;
    $("body").i18n();
    if (lang === "es") {
      $("#qr-reader__camera_permission_button").html(
        "Solicitar permisos de la camara"
      );
      //$('#qr-reader__dashboard_section_csr>span').html($('#qr-reader__dashboard_section_csr>span').html().replace('Select Camera', 'Seleccionar Camara'));
      $("#qr-reader__dashboard_section_csr>span>button:first-child").html(
        "Empezar a escanear"
      );
      $("#qr-reader__dashboard_section_csr>span>button:last-child").html(
        "Detener escaneo"
      );
    } else {
      $("#qr-reader__camera_permission_button").html(
        "Request Camera Permissions"
      );
      //$('#qr-reader__dashboard_section_csr>span').html($('#qr-reader__dashboard_section_csr>span').html().replace('Seleccionar Camara', 'Select Camera'));
      $("#qr-reader__dashboard_section_csr>span>button:first-child").html(
        "Start Scanning"
      );
      $("#qr-reader__dashboard_section_csr>span>button:last-child").html(
        "Stop Scanning"
      );
    }
  });
};
