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

window.onload = function () {
  console.log("starting program ...");
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
      genderLabel: "Gender",
      documentNumberLabel: "Doc. Number",
      vaccinationDetailsLabel: "Vaccination Details",
      certificateIdentifierLabel: "Certificate Identifier",
      certificateIssuerLabel: "Issuer",
      vaccineDetailsLabel: "Vaccine Details",
      productNameLabel: "Product Name",
      atcCodeLabel: "ATC Code",
      vaccinationCentreLabel: "Vaccination Centre",
      numberOfDosesLabel: "Number of Doses",
      dateOfVaccinationLabel: "Date of vaccination",
      batchNumberLabel: "Batch Number",
      identificationDataLabel: "Identification Data",
      viewDetailsText: "View Details",
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
      genderLabel: "Género",
      documentNumberLabel: "Nº de doc.",
      vaccinationDetailsLabel: "Datos de la vacunación",
      certificateIdentifierLabel: "Identificador del certificado",
      certificateIssuerLabel: "Emisor",
      vaccineDetailsLabel: "Datos de la vacuna",
      productNameLabel: "Nombre del producto",
      atcCodeLabel: "ATC Code",
      vaccinationCentreLabel: "Centro de Vacunación",
      numberOfDosesLabel: "Número de dosis",
      dateOfVaccinationLabel: "Fecha de vacunación",
      batchNumberLabel: "Número de Lote",
      identificationDataLabel: "Datos de identificación",
      viewDetailsText: "Ver Detalles",
    },
  });

  // var resultContainer = document.getElementById("qr-reader-results");
  var lastResult,
    countResults = 0;
  function renderResults(decodedText) {
    let compatibility = "";
    if (
      decodedText.startsWith("HC1:") ||
      decodedText.startsWith("https://sso.panamadigital.gob.pa") ||
      decodedText.startsWith("https://carnetdigital.mspbs.gov.py")
    )
      compatibility = "EU-DCC";

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

    const items = [
      "no-vaccination-standard-item",
      "who-ddcc-standard-item",
      "divoc-standar-item",
      "smart-health-card-standard-item",
      "eu-dcc-item",
      "national-interoperability-item",
    ];

    let itemsToRemove = [];

    switch (compatibility) {
      case "DIVOC":
        $("#divoc").prop("checked", true);
        $("#national").prop("checked", true);
        break;
      case "EU-DCC":
        $("#eu-dcc").prop("checked", true);
        $("#national").prop("checked", true);
        $("#eu-dcc-item").removeClass("hide").addClass("showx");
        itemsToRemove = items.filter((item) => item !== "eu-dcc-item");
        setWhoDDCCModal();
        break;
      case "National":
        $("#national").prop("checked", true);
        break;
      case "SHC":
        $("#shc").prop("checked", true);
        $("#national").prop("checked", true);
        break;
      default:
        $("#none").prop("checked", true);
        break;
    }

    itemsToRemove.map((item) => {
      var element = document.getElementById(item);
      element.parentNode.removeChild(element);
    });
    $("#step1").removeClass("showx").addClass("hide");
    $("#result").addClass("showx").show();
  }

  function setWhoDDCCModal() {
    /**render modal */
    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the button that opens the modal
    const btn = document.getElementById("myBtn");

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

  function onScanSuccess(decodedText, decodedResult) {
    if (html5QrcodeScanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
      // Add this check to ensure success callback is not being called
      // from file based scanner.

      // Pause on scan result
      html5QrcodeScanner.pause();
    }

    if (decodedText !== lastResult) {
      console.log("decoded Text", decodedText);
      console.log("decoded Result", decodedResult);
      ++countResults;
      lastResult = decodedText;

      renderResults(decodedText);
    }
  }

  // Optional callback for error, can be ignored.
  function onScanError(qrCodeError) {
    console.log(`Scan error ....`, qrCodeError);
    // This callback would be called in case of qr code scan error or setup error.
    // You can avoid this callback completely, as it can be very verbose in nature.
  }

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

  var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
    fps: 10,
    qrbox: qrboxFunction,
    rememberLastUsedCamera: false,
  });
  html5QrcodeScanner.render(onScanSuccess, onScanError);

  // const decodedText =
  //   "HC1:6BF1.N3DBSNAP53-OPX:5I Q-N0V0PUF247V.WM3G5GRRDN1:N9WC4/E2ZL7-/T.MN6.9RN79%2O72NB0XY6$BLZ$4R92OTPP74EE4H*ORW7:0P5IORZ69T4*U4CYS+D3MZ8J5C5XQ5VP7ES9UU:A3YZR%3LOU9TKRE8V+4O-3WAX24.MQ*6JRH.0HB.2*IBOSE%NLTFIW G:3577UX-3F7H%:D7L2SP3KXS0CHQI0VC3ZLC%O6I9U8M4R81U GFDOHWHKEFXBG+LRGV6EE5SYAFGI JIVISLKHB58.YN/L8B1ALO4.O20FJGYK7:B3/Q+RHZ97$QUG45:WV2 3UK011JZ42+SU8EFF+1/1J%AJT4OZQ0UGFNDIT9IXR9.63/NB6 1I%D488+7BJO309A.9T7D9R9GQ-SRWQ9GRHF7MSUX.BFDWO/OP9F0YGO6A/%N*N0YNCN*L*K6/IS$LC/98D2095I3KEDKJN%S.T6*B8 TUT99K%82WQN170PHWOQ7OAM0GI74YB0FB47CWAM2DQEM-DNH2QX5MQTT%8EVG55G9RT10JW-H6%L3Z8EMK:$I2CI%$P6KT9*8F68OL5QAH+CC RV21V QEC3K74K$S0WTN3UU+U9W5C-NO8D8A7JEWABQFAOK.GAYLVB31E56YLG4H9INAQA5T76MJUR%NJZH/A7%ODS7RFVEAB8-75GE4XQA9KA7WGZ*3+8O6EW:EJR/RO*9. ETA3933VN9ZQQAEC94NJLT2AQOCDF0TAGBF:192S45VG3AT 3FB1O/UO4RC 6B6RC$2.XO9IM5/NR.IFNCB-7AQP*FJSLJS+RF2TQUBHVH1QUQ K5H2L6AC.1SAVA*AFYDIVJZBOZCR*9F-UUFXRENHFD33P7/9US6TB+TWHROW6FPV4%4 IB*PN964Y6UJ:O1M39RBWWR/:5*:NNC39JN0:7ML9VHIL.NNOSQ2IQTK*8J-7RYNR4%TQEH82CY%NP/U*HOFU1A5GFP8%$MJ:PRUR9YEXXU4RHB+71GFXFC92VEZEDXN5%V$IQALQ3ATTG1N 7HNE3:E477GJQ-/3UI6T.6PC8*GC$KMNX9 /O-8SE+1M 0 P1K2";
  // renderResults(decodedText);

  $("#button1").click(function () {
    $("#result").removeClass("showx").addClass("hide");
    $("#step2").addClass("showx").show();
    $(window).scrollTop(0);
  });
  $("#button1b").click(function () {
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

/**

HC1:6BF1.N3DBSNAP53-OPX:5I Q-N0V0PUF247V.WM3G5GRRDN1:N9WC4/E2ZL7-/T.MN6.9RN79%2O72NB0XY6$BLZ$4R92OTPP74EE4H*ORW7:0P5IORZ69T4*U4CYS+D3MZ8J5C5XQ5VP7ES9UU:A3YZR%3LOU9TKRE8V+4O-3WAX24.MQ*6JRH.0HB.2*IBOSE%NLTFIW G:3577UX-3F7H%:D7L2SP3KXS0CHQI0VC3ZLC%O6I9U8M4R81U GFDOHWHKEFXBG+LRGV6EE5SYAFGI JIVISLKHB58.YN/L8B1ALO4.O20FJGYK7:B3/Q+RHZ97$QUG45:WV2 3UK011JZ42+SU8EFF+1/1J%AJT4OZQ0UGFNDIT9IXR9.63/NB6 1I%D488+7BJO309A.9T7D9R9GQ-SRWQ9GRHF7MSUX.BFDWO/OP9F0YGO6A/%N*N0YNCN*L*K6/IS$LC/98D2095I3KEDKJN%S.T6*B8 TUT99K%82WQN170PHWOQ7OAM0GI74YB0FB47CWAM2DQEM-DNH2QX5MQTT%8EVG55G9RT10JW-H6%L3Z8EMK:$I2CI%$P6KT9*8F68OL5QAH+CC RV21V QEC3K74K$S0WTN3UU+U9W5C-NO8D8A7JEWABQFAOK.GAYLVB31E56YLG4H9INAQA5T76MJUR%NJZH/A7%ODS7RFVEAB8-75GE4XQA9KA7WGZ*3+8O6EW:EJR/RO*9. ETA3933VN9ZQQAEC94NJLT2AQOCDF0TAGBF:192S45VG3AT 3FB1O/UO4RC 6B6RC$2.XO9IM5/NR.IFNCB-7AQP*FJSLJS+RF2TQUBHVH1QUQ K5H2L6AC.1SAVA*AFYDIVJZBOZCR*9F-UUFXRENHFD33P7/9US6TB+TWHROW6FPV4%4 IB*PN964Y6UJ:O1M39RBWWR/:5*:NNC39JN0:7ML9VHIL.NNOSQ2IQTK*8J-7RYNR4%TQEH82CY%NP/U*HOFU1A5GFP8%$MJ:PRUR9YEXXU4RHB+71GFXFC92VEZEDXN5%V$IQALQ3ATTG1N 7HNE3:E477GJQ-/3UI6T.6PC8*GC$KMNX9 /O-8SE+1M 0 P1K2

 */

/**
 H4sIAAAAAAAAA7VU2W7bOBR971cEnsepbe6kDBSYeEvbaZ02bpI2gz5wtZnIkkNJdpKi/z5UZMfOgsFMgQH8IPMe3uWcw/vj1cFB6w+dZ6W9KVu9g7/i/3gyL8tl0et21+t1Z407eZh1EYCiq4M1Niu9TIvuCrZeP0bvRdupV0GG204qtZ5Ln3UyWz66
 */
