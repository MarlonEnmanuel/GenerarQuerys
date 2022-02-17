//prueba
$('#txtOrig').val('s2c_mepeco');
$('#txtDest').val('s2d_prico');
// $('#txtIniciales').val('mm');
// $('#txtTicket').val('R-233671');

var inputs = null;
var tablas = null;
const BR = '\n';

const ObtenerInputs = () => {
    // obtener inputs
    inputs = {
        txtOrig : $('#txtOrig').val().trim(),
        txtDest : $('#txtDest').val().trim(),
        txtIniciales : $('#txtIniciales').val().trim(),
        txtTicket : $('#txtTicket').val().trim(),
        txtData : $('#txtData').val().trim(),
    };

    // validar inputs
    if (!inputs.txtDest) { alert('Ingresa Destino'); return; }
    // if (!inputs.txtOrig) { alert('Ingresa Origen'); return; }
    if (!inputs.txtIniciales) { alert('Ingresa Iniciales'); return; }
    if (!inputs.txtTicket) { alert('Ingresa Ticket'); return; }
    if (!inputs.txtData) { alert('Ingresa Formularios/Ordenes'); return; }

    // transformar data
    try {
        inputs.txtData = inputs.txtData.split(BR)
                                        .map(ln => ln.trim())
                                        .filter(ln => !!ln.trim())
                                        .map(function (ln) {
                                            var a = ln.split(',')[0].trim();
                                            var b = ln.split(',')[1].trim();
                                            if (!a||!b) throw "error";
                                            if (a.length>4) throw "error";
                                            a = parseInt(a);
                                            b = parseInt(b);
                                            if (isNaN(a)||isNaN(b)) throw "error";
                                            if (a<0||b<0) throw "error";
                                            return  { form:  a, orden: b };
                                        });
    } catch (ex) {
        alert('Formularios/Ordenes con error'); 
        return false;
    }
    return true;
}

const GenTablaData = (db, inst, tb, sub = '') => {
    // var f = inst === "s2d_prico" || inst === "s2c_mepeco" || inst === "s1_prico";
    var f = false;
    return {
        inst: inst, 
        tabla: f ? `${db}:${tb}` : `${db}@${inst}:${tb}`,
        temporal: `tmp_${inputs.txtIniciales}_${tb}${sub}`,
        file: `tbl_${inputs.txtIniciales}_${inputs.txtTicket}_${tb}${sub}.txt`,
    };
}
const GenTablaDataDest = (db, tb) => GenTablaData(db, inputs.txtDest, tb, '_dest');
const GenTablaDataOrig = (db, tb) => GenTablaData(db, inputs.txtOrig, tb, '_orig');

const GenerarTablas = () => {

    // tablas y parametros
    tablas = {
        // descentralizadas
        pag : {
            check: $('#tbl_pag').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE pag_formul = ${frm} AND pag_ndocpa = ${ord};`,
            dest: GenTablaDataDest('sirat','pag'),
            orig: GenTablaDataOrig('sirat','pag'),
            cabeceras: 'pag_numrec|pag_formul|pag_ndocpa|pag_codfor|pag_numdoc|pag_numruc|pag_fecpag|pag_perpag|pag_semana|pag_numcaj|pag_turno|pag_banco|pag_agebco|pag_tiptra|pag_resrec|pag_folio|pag_totefe|pag_totche|pag_totdov|pag_indpag|pag_nropag|pag_indban|pag_tipdoc|pag_indcon|pag_indinc|pag_indcom|pag_indmed|pag_indvia|pag_recibe|pag_nabono|pag_userna|pag_fecact|pag_horact',
            iform: 1,
            iorden: 2,
        },
        crt : {
            check: $('#tbl_crt').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE crt_formul = ${frm} AND crt_ndocpa = ${ord} AND crt_indpag IN (1,5) ORDER BY crt_fecpag;`,
            dest: GenTablaDataDest('sirat','crt'),
            orig: GenTablaDataOrig('sirat','crt'),
            cabeceras: 'crt_depens|crt_formul|crt_ndocpa|crt_numrec|crt_forpag|crt_numche|crt_numruc|crt_perpag|crt_semana|crt_codtri|crt_tiptra|crt_sispag|crt_codfor|crt_numdoc|crt_fecpag|crt_indban|crt_fecacr|crt_imptri|crt_impint|crt_indpag|crt_indaju|crt_forori|crt_docori|crt_indimp|crt_motnim|crt_estado|crt_impcap',
            iform: 1,
            iorden: 2,
        },
        dbt : {
            check: $('#tbl_dbt').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE dbt_formul = ${frm} AND dbt_numdoc = '${ord}';`,
            dest: GenTablaDataDest('sirat','dbt'),
            cabeceras: 'dbt_depens|dbt_numruc|dbt_perpag|dbt_semana|dbt_codtri|dbt_tiptra|dbt_formul|dbt_numdoc|dbt_docrec|dbt_nrorec|dbt_import|dbt_imppag|dbt_intpag|dbt_intacu|dbt_impext|dbt_deuori|dbt_fecdoc|dbt_fecact|dbt_numres|dbt_ultpag|dbt_indrec|dbt_sitdeu|dbt_indaju|dbt_paganc|dbt_fecapi',
            iform: 6,
            iorden: 7,
        },
        db2 : {
            check: $('#tbl_db2').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE db2_formul = ${frm} AND db2_numdoc = '${ord}';`,
            dest: GenTablaDataDest('sirat','db2'),
            cabeceras: 'db2_numruc|db2_perpag|db2_semana|db2_codtri|db2_tiptra|db2_formul|db2_numdoc|db2_basimp|db2_basmin|db2_imptri|db2_impdec|db2_impdet|db2_otrodb|db2_intdec|db2_impcal|db2_impdca|db2_intcal|db2_sacrad|db2_export|db2_venogr|db2_inddbi|db2_inddsf|db2_cremes|db2_creant|db2_transf|db2_compen|db2_pagcta|db2_tasa|db2_otrocr|db2_adqbrg|db2_adqbrs|db2_reintm|db2_salfim|db2_sipdec|db2_sipdet|db2_rubro|db2_ciiu|db2_forori',
            iform: 5,
            iorden: 6,
        },
        t539tre : {
            check: $('#tbl_t539tre').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE tre_codfor = ${frm} AND tre_numdoc = ${ord};`,
            dest: GenTablaDataDest('sirat','t539tre'),
            cabeceras: 'tre_codfor|tre_numdoc|tre_codtri|tre_numruc|tre_perpag|tre_semana|tre_fecdoc|tre_nrorec|tre_impori|tre_imprec|tre_forori|tre_docori|tre_forant|tre_docant|tre_indrec|tre_estado|tre_fecver|tre_origen|tre_tipver|tre_indenv|tre_fecenv|tre_induci',
            iform: 0,
            iorden: 1,
        },
        // centralizadas
        t471crb : {
            check: $('#tbl_t471crb').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE t471_formulario = '${frm.toString().padStart(4,'0')}' AND t471_norden = ${ord};`,
            dest: GenTablaDataDest('sirat','t471crb'),
            cabeceras: 't471_nabono|t471_nresumen|t471_formulario|t471_norden|t471_lltt_ruc|t471_periodo|t471_semana|t471_codtri|t471_f_presenta|t471_folio|t471_rechazado|t471_indfte|t471_indpre|t471_sitdoc|t471_coderr|t471_secuencia|t471_userna|t471_fecact',
            iform: 2,
            iorden: 3,
        },
        doc : {
            check: $('#tbl_doc').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE doc_formul = ${frm} AND doc_numdoc = ${ord};`,
            dest: GenTablaDataDest('sirat','doc'),
            orig: GenTablaDataOrig('sirat','doc'),
            cabeceras: 'doc_nabono|doc_formul|doc_numdoc|doc_codcas|doc_valdec|doc_valcal|doc_valdet|doc_inderr|doc_indrec',
            iform: 1,
            iorden: 2,
            orderby: 3,
        },
        t03djcab : {
            check: $('#tbl_t03djcab').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE t03formulario = '${frm.toString().padStart(4,'0')}' AND t03norden = ${ord};`,
            dest: GenTablaData('recauda','s0_bancos','t03djcab'),
            cabeceras: 't03nabono|t03nresumen|t03ncaratula|t03codresumen|t03formulario|t03folio|t03norden|t03lltt_ruc|t03indica|t03periodo|t03f_presenta|t03autorden|t03nrocheque|t03bcolibrad|t03rechazado|t03rectifica|t03nrosemana|t03sintotal|t03cnumero|t03ecaptura|t03digit1|t03digit2|t03digit3|t03digit4|t03digit5|t03digit6|t03estado',
            iform: 4,
            iorden: 6,
        },
        t04djdet : {
            check: $('#tbl_t04djdet').is(':checked'),
            query: (tbl, frm, ord) => `SELECT a.* FROM ${tbl} a, ${tbl.substring(0,tbl.indexOf(":"))}:t03djcab b WHERE a.t04nabono = b.t03nabono AND b.t03formulario = '${frm.toString().padStart(4,'0')}' AND b.t03norden = ${ord} AND b.t03norden = a.t04norden;`,
            dest: GenTablaData('recauda','s0_bancos','t04djdet'),
            cabeceras: 't04nabono|t04formulario|t04norden|t04casilla|t04i_valor|t04indcaptura|t04idcasilla|t04estado',
            iform: 1,
            iorden: 2,
            orderby: 3,
        },
        t869rei_cab : {
            check: $('#tbl_t869rei_cab').is(':checked'),
            query: (tbl, frm, ord) => `SELECT * FROM ${tbl} WHERE cod_for = ${frm} AND num_doc = ${ord};`,
            dest: GenTablaDataDest('sirat','t869rei_cab'),
            orig: GenTablaDataOrig('sirat','t869rei_cab'),
            cabeceras: 'cod_for_rei|num_doc_rei|cod_for|num_doc|num_ruc|fec_doc|ind_aplica|ind_motivo|des_motivo|fec_rei|ind_envio|cod_res_rei|cod_user',
            iform: 2,
            iorden: 3,
        },
        t870rei_det : {
            check: $('#tbl_t870rei_det').is(':checked'),
            query: (tbl, frm, ord) => `SELECT b.* FROM ${tbl.substring(0,tbl.indexOf(":"))}:t869rei_cab a, ${tbl} b WHERE a.cod_for = ${frm} AND a.num_doc = ${ord} AND b.cod_for_rei = a.cod_for_rei AND b.num_doc_rei = a.num_doc_rei;`,
            dest: GenTablaDataDest('sirat','t870rei_det'),
            orig: GenTablaDataOrig('sirat','t870rei_det'),
            cabeceras: 'cod_for_rei|num_doc_rei|cod_sec_rei|ind_aplica|ind_accion|cod_for|num_doc|num_cuo|cod_tri|per_doc|num_sem|tri_inf|tip_tra|mto_tri|mto_int|mto_cap',
            iform: 5,
            iorden: 6,
        },
    };
};

const RecordarInputs = (ticket) => {
    var cache = localStorage.getItem(`querys_inputs_${ticket}`);
    if (!cache) return;
    var data = JSON.parse(cache);
    data.text.forEach(el => $('#'+el.id).val(el.val));
    data.check.forEach(el => $('#'+el.id).prop('checked', el.val));
    GenerarQuerys();
}

const CachearInputs  = () => {
    var data = {
        text: [],
        check: [],
    };
    $('.AppInputs input[type="text"], .AppInputs textarea').each((i,el) => {
        data.text.push({
            id: el.id,
            val: $(el).val(),
        });
    });
    $('.AppInputs input[type="checkbox"]').each((i, el) => {
        data.check.push({
            id: el.id,
            val: $(el).is(':checked'),
        });
    });
    localStorage.setItem(`querys_inputs_${inputs.txtTicket}`, JSON.stringify(data));
}

const GenerarQuerys = () => {
    
    if (!ObtenerInputs()) return;
    CachearInputs();
    GenerarTablas();
    
    var multi = inputs.txtData.length > 1; // flag para saber si es un solo pago o varios pagos

    const PushComentario = (txt) => {
        querys['s0_bancos'].push(txt);
        querys[inputs.txtOrig].push(txt);
        querys[inputs.txtDest].push(txt);
    };

    // generar querys
    var querys = {};
    querys[inputs.txtOrig] = [`-- EJECUTAR EN ${inputs.txtOrig}`];
    querys[inputs.txtDest] = [`-- EJECUTAR EN ${inputs.txtDest}`];
    querys['s0_bancos'] = [`-- EJECUTAR EN s0_bancos`];
    PushComentario('');

    // temporales
    if (multi) {
        PushComentario('-- CREAR TEMPORALES');
        Object.keys(tablas).forEach(function (tbname){
            var tabla = tablas[tbname];
            if (!tabla.check) return;

            const print = (tb) => {
                querys[tb.inst].push(`SELECT * FROM ${tb.tabla} WHERE 1 = 0 INTO TEMP ${tb.temporal} WITH NO LOG;`);
            }
            if (tabla.dest && inputs.txtDest) print(tabla.dest);
            if (tabla.orig && inputs.txtOrig) print(tabla.orig);
        });
        PushComentario('');
    }

    // querys
    if (multi) PushComentario('-- EXTRACCION DE DATA');
    Object.keys(tablas).forEach(function (tbname){
        var tabla = tablas[tbname];
        if (!tabla.check) return;

        const print = (tb) => {
            querys[tb.inst].push(`-- Tabla ${tbname}`);
            inputs.txtData.forEach(row => {
                var q = "";
                q += multi ? `INSERT INTO ${tb.temporal} ` : `UNLOAD TO '${tb.file}' ${BR}`;
                q += tabla.query(tb.tabla, row.form, row.orden);
                querys[tb.inst].push(q);
                if (!multi) querys[tb.inst].push('');
            });
        }
        if (tabla.dest && inputs.txtDest) print(tabla.dest);
        if (tabla.orig && inputs.txtOrig) print(tabla.orig);
    });
    if (multi) PushComentario('');

    // unload y drop
    if (multi) {
        PushComentario('-- DESCARGAR Y ELIMINAR TEMPORALES');
        Object.keys(tablas).forEach(function (key){
            var tabla = tablas[key];
            if (!tabla.check) return;

            const print = (tb) => {
                querys[tb.inst].push(`UNLOAD TO '${tb.file}' SELECT * FROM ${tb.temporal}; DROP TABLE IF EXISTS ${tb.temporal};`);
            }
            if (tabla.dest && inputs.txtDest) print(tabla.dest);
            if (tabla.orig && inputs.txtOrig) print(tabla.orig);
        });
        PushComentario('');
    }
    
    // imprimir
    $('#txtQuerys').val(
        querys[inputs.txtDest].join(BR) + BR + BR +
        querys[inputs.txtOrig].join(BR) + BR + BR +
        querys['s0_bancos'].join(BR)
    );
}

const CargarArchivos = async () => {
    
    if (!ObtenerInputs()) return;
    GenerarTablas();

    // leer archivos
    var files = $('#txtArchivos').get(0).files;

    if (!files.length) {
        alert('Debe seleccionar archivos!'); return;
    }

    // validar archivos completos
    var faltan = [];
    Object.keys(tablas).forEach(key => {
        var tb = tablas[key];
        if (!tb.check) return;
        
        if (tb.dest && inputs.txtDest) {
            if (Array.from(files).filter(f => f.name == tb.dest.file).length == 0) faltan.push(tb.dest.file);
        }
        if (tb.orig && inputs.txtOrig) {
            if (Array.from(files).filter(f => f.name == tb.orig.file).length == 0) faltan.push(tb.orig.file);
        }
    });
    if (faltan.length > 0) {
        alert (`Faltan los archivos: ${BR}` + faltan.join(BR));
        return;
    }

    // extraer contenido
    var contenido = {};
    await Promise.all(Object.keys(tablas).map(async key => {
        var tabla = tablas[key];
        if (!tabla.check) return;

        const extraer = async (tb) => {
            var txt = await Array.from(files).filter(f => f.name == tb.file)[0].text();
            contenido[key+tb.inst] = txt.split(BR).map(row => row.split('|').map(col => col.trim()));
            if ("orderby" in tabla)
                contenido[key+tb.inst] = contenido[key+tb.inst].sort((a,b) => parseInt(a[tabla.orderby]) - parseInt(b[tabla.orderby]));
        };
        if (tabla.orig && inputs.txtOrig) await extraer(tabla.orig);
        if (tabla.dest && inputs.txtDest) await extraer(tabla.dest);
    }));

    function genHtmlCeldas (data, relleno = '') {
        return  data.map(cols => cols.map(col => `<td class="td">${col}</td>`))
                    .map(cols => [`<td class="right">${relleno}</td>`].concat(cols))
                    .map(cols => {cols.pop(); return cols;})
                    .map(cols => `<tr>${cols.join('')}</tr>`)
                    .join(BR);
    }
    function genHtmlCabecera (data) {
        var html = data.split('|')
                        .map(col => `<td class="tdc">${col}</td>`)
                        .join('');
        return `<tr><td></td>${html}</tr>${BR}`;
    }

    // leer en orden e imprimir
    var text = "";
    inputs.txtData.forEach(row => {

        text += `<tr class="fondo"><td class="bold" colspan="10">Nro de Orden ${row.orden} / Formulario ${row.form}</td></tr>${BR}`;
        text += `<tr><td></td></tr>${BR}`;
        
        Object.keys(tablas).forEach(tbName => {
            var tb = tablas[tbName];
            if (!tb.check) return;

            text += `<tr><td class="bold">Tabla ${tbName}</td></tr>${BR}`;
            
            if (tb.orig && inputs.txtOrig) {

                var origs = contenido[tbName+tb.orig.inst]
                                .filter(cols => parseInt(cols[tb.iform]) == row.form && parseInt(cols[tb.iorden]) == row.orden);
                var dests = contenido[tbName+tb.dest.inst]
                                .filter(cols => parseInt(cols[tb.iform]) == row.form && parseInt(cols[tb.iorden]) == row.orden);
                
                text += genHtmlCabecera(tb.cabeceras);
                // origen
                if (origs.length == 0) 
                    text += `<tr><td>Origen</td><td class="td" colspan="${tb.cabeceras.split('|').length}">Sin registros</td></tr>`;
                else  text += genHtmlCeldas(origs, 'Origen');
                // destino
                if (dests.length == 0) 
                    text += `<tr><td>Destino</td><td class="td" colspan="${tb.cabeceras.split('|').length}">Sin registros</td></tr>`;
                else  text += genHtmlCeldas(dests, 'Destino');
            } else {
                var dests = contenido[tbName+tb.dest.inst]
                                .filter(cols => parseInt(cols[tb.iform]) == row.form && parseInt(cols[tb.iorden]) == row.orden);
                if (dests.length > 0) {
                    text += genHtmlCabecera(tb.cabeceras);
                    text += genHtmlCeldas(dests);
                } else {
                    text += `<tr><td></td><td colspan="${tb.cabeceras.split('|').length}">Sin registros</td></tr>`;
                }
            }
            text += `<tr><td></td></tr>${BR}`;
        });
        text += `<tr><td></td></tr>${BR}`;
    });

    text = `<html>
<head>
<meta charset="UTF-8">
<title>Ticket ${inputs.txtTicket}</title>
<style>
table tr td { font-size: 11pt; white-space: normal; text-justify: inter-word; }
.fondo { background-color: #D9E1F2; }
.bold { font-weight: bold; }
.td { border: 0.5pt solid #757575; mso-number-format:"\@"; }
.tdc { font-weight: bold; border: 0.5pt solid #757575; mso-number-format:"\@"; }
.right { text-align: right; };
</style>
</head>
<body>
<table>
${text}</table>
</body>
</html>`;
    $('#txtOrdenado').val(text);
}


// Eventos

// copiar texto
$('#btnCopiar').click(function() {
    var copyText = document.getElementById("txtQuerys");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    alert('Querys copiados!');
});
$('#btnCopiar2').click(function() {
    var copyText = document.getElementById("txtOrdenado");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    alert('Texto copiados!');
    
    // descargar
    var el = document.createElement('a');
    el.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent($('#txtOrdenado').val()));
    el.setAttribute('download', `Análisis ${inputs.txtTicket}`);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
});

// cache de datos
$('#txtTicket').blur(() => {
    var tk = $('#txtTicket').val().trim();
    document.title = tk;
    RecordarInputs(tk);
});

// logica
$('#btnGenerar').click(() => {
    GenerarQuerys();
});
$('#btnCargar').click(async () => {
    await CargarArchivos();
});
