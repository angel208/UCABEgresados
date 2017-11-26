var Excel = require('exceljs');


module.exports = {

    GenerateExcel:  function GenerateExcel( resultados, res ){
        //creamos el workbook
            var workbook = new Excel.Workbook();

        //seteamos las propiedades del workbook
        workbook.creator = 'Comision Electoral UCAB Guayana';
        workbook.lastModifiedBy = 'Comision Electoral UCAB Guayana';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();


        //The Workbook views controls how many separate windows Excel will open when viewing the workbook.
        workbook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 0, visibility: 'visible'
            }
        ]

        //creamos las worksheets del libro
        var Egresados_sheet = workbook.addWorksheet('Egresados', {properties: {tabColor: {argb: '660033'}}});
        var Consejos_sheet = workbook.addWorksheet('Consejos', {properties: {tabColor: {argb: '009933'}}});

        ///////////////////////////////  comenzamos a agregar filas  /////////////////////////////////////////////

        // add image to workbook by filename
        var imageId1 = workbook.addImage({
            filename: __dirname + '/app/sources/logoucab.jpg',
            extension: 'jpg',
        });

        Egresados_sheet.addImage(imageId1, 'A1:B4');
        Consejos_sheet.addImage(imageId1, 'B1:C4');

        //cambiamos el ancho de las columnas que sean necesarias.
        Egresados_sheet.getColumn('A').width = 30;
        Egresados_sheet.getColumn('B').width = 25;

        Consejos_sheet.getColumn('C').width = 45;


        // Asi modificamos o  añadimos una nueva celda:
        Egresados_sheet.getCell('A5').value = "Resultados de los Representantes de Egresados, noviembre 2017 - Sede Guayana";

        // unimos las celdas recien creadas.
        Egresados_sheet.mergeCells('A5:K5');

        //obtenemos la celda que acabamos de unir, y cambiamos su alineacion a "Centrado"
        //cabe destacas, que las celdas unidas estan enlazadas (A5=B5=...=K5)
        Egresados_sheet.getCell('A5').alignment = {vertical: 'middle', horizontal: 'center'};
        Egresados_sheet.getCell('A5').font = {name: 'Calibri', size: 20, bold: true};

        //a;ade una fila en blanco
        addEmptyRows(Egresados_sheet, 1);

        //------ LLENADO DE LOS DATOS DE LAS ELECCIONES
        resultados.forEach( function( cargo, index ){
            <!-- se ignoran los cargos duplicados -->
            if ( index == 0 || cargo.IDCargo != resultados[index-1].IDCargo ){

                addEmptyRows(Egresados_sheet, 1);
                Egresados_sheet.addRow(["Para el "+ cargo.NombreCargo]);
                Egresados_sheet.addRow([" ",' ', "Votos"]);

               resultados.forEach( function ( postulado ){
                   if (postulado.IDCargo == cargo.IDCargo){

                        Egresados_sheet.addRow([ postulado.NombreEgresado, postulado.NombreCarrera   ,parseInt(postulado.Votos)]);
                        var row = Egresados_sheet.lastRow;
                        row.getCell(1).border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
                        row.getCell(2).border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
                        row.getCell(3).border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
                    }
               });

                addEmptyRows(Egresados_sheet, 1);
            }
        });

        //------ FIN DE LLENADO DE LA HOJA 1

        // Asi modificamos o  añadimos una nueva celda:
        Consejos_sheet.getCell('B6').value = "Consejos en los cuales tienen representación los egresados:";

        // unimos las celdas recien creadas.
        Consejos_sheet.mergeCells('B6:D6');

        //obtenemos la celda que acabamos de unir, y cambiamos su alineacion a "Centrado"
        //cabe destacas, que las celdas unidas estan enlazadas (A5=B5=...=K5)
        Consejos_sheet.getCell('B6').alignment = {vertical: 'middle', horizontal: 'center'};
        Consejos_sheet.getCell('B6').font = {name: 'Calibri', size: 12, bold: true};

        addEmptyRows(Egresados_sheet, 1);

        resultados.forEach( function( cargo, index ){
            <!-- se ignoran los cargos duplicados -->
            if ( index == 0 || cargo.IDCargo != resultados[index-1].IDCargo ){

                Consejos_sheet.addRow([ " " , " ", cargo.NombreCargo]);

            }
        });


        ///////////////////////////////  FIN DE agregar filas  /////////////////////////////////////////////


        //escribimos nuestro workbook en el archivo
        //var tempFilePath = tempfile("Resultados Egresados UCAB.xlsx");

        workbook.xlsx.writeFile("app/sources/Resultados Egresados UCAB.xlsx").then(function() {

            console.log("writen");

            res.sendFile("app/sources/Resultados Egresados UCAB.xlsx", { root : __dirname} , function(err){
                console.log('---------- error downloading file: ' + err);
            });
        });


    }


};


function addEmptyRows( workSheet, qty ){
    for ( var i = 0; i < qty ; i++)
         workSheet.addRow();
}

