(function() {
var Game = function( element ) {
   this.element = document.getElementById(element) ;
   this.init() ;
   } ;

Game.prototype = {
   init : function() {

      this.levelSettings = {
         themelist : [ "grey" , "copper" , "green" , "red" , "yellow" , "purple" , "orange" , "darkgrey" , "blue" , "maroon" ] ,
         theme : "grey" ,
         rank : 1 ,
         speed : 1020 ,
         speedrate : 50 ,
         cursor : true ,
         alive : true ,
         keydown : undefined ,
         keyup : undefined
         } ;

      this.gridSettings = {
         size : 30 ,
         matrix : [] ,
         horizontal : 11 ,
         vertical : 20
         } ;

      this.position = {
         movement : undefined ,
         horizontal : undefined ,
         vertical : 0
         } ;

      this.main = {
         block : undefined ,
         nextblock : undefined
         } ;

      this.score = {
         quadra : 1000 ,
         row : 100 ,
         knockouts : 0 ,
         points : 0
         } ;

      this.command = {
         keyslist : [ 37 , 39 , 40 ] ,
         keys : [] ,
         codekey : undefined ,
         manual : false
         } ;

      this.blockList = [
         { name : "long_bar" , color : "purple" , grid_y : 4 , grid_x : 1 , matrix : [ "1111" , "1111" ] } ,
         { name : "long_angle" , color : "green" , grid_y : 2 , grid_x : 3 , matrix : [ "111001" , "010111" , "100111" , "111010" ] } ,
         { name : "three_pointed" , color : "blue" , grid_y : 2 , grid_x : 3 , matrix : [ "111010" , "011101" , "010111" , "101110" ] } ,
         { name : "right_angle" , color : "yellow" , grid_y : 2 , grid_x : 2 , matrix : [ "1110" , "1101" , "0111" , "1011" ] } ,
         { name : "zig_zag" , color : "red" , grid_y : 2 , grid_x : 3 , matrix : [ "110011" , "011110" ] } ,
         { name : "big_box" , color : "orange" , grid_y : 2 , grid_x : 2 , matrix : [ "1111" ] } ,
         { name : "horse_shoe" , color : "grey" , grid_y : 2 , grid_x : 3 , matrix : [ "111101" , "110111" , "101111" , "111011" ] } ,
         { name : "dash" , color : "maroon" , grid_y : 2 , grid_x : 1 , matrix : [ "11" , "11" ] }
         ] ;

      this.console = this.element.getElementsByClassName("console")[0] ;
      this.field_wrap = this.element.getElementsByClassName("field_wrap")[0] ;
      this.field = this.element.getElementsByClassName("field")[0] ;
      this.block_wrap = this.element.getElementsByClassName("block_wrap")[0] ;
      this.preview = this.element.getElementsByClassName("preview")[0] ;
      this.score_wrap = this.element.getElementsByClassName("score_wrap")[0] ;
      this.score_span = this.element.getElementsByClassName("score")[0] ;
      this.level = this.element.getElementsByClassName("level")[0] ;

      this.setupLevelSettings() ;
      this.buildGrid() ;
      this.createStart() ;
      } ,

   setupLevelSettings : function() {
      var self = this ;
      var width = self.gridSettings.size * self.gridSettings.horizontal ;
      var height = self.gridSettings.size * self.gridSettings.vertical ;
      self.field_wrap.style.width = width + "px" ;
      self.field_wrap.style.height = height + "px" ;
      self.field.style.width = width + "px" ;
      self.field.style.height = height + "px" ;
      self.field.style.marginBottom = "-" + height + "px" ;
      } ,

   buildGrid : function() {
      var self = this ;

      var y ;
      var x ;
      for ( y = 0 ; y < self.gridSettings.vertical ; y++ )
         {
         var arr = [] ;
         var row = self._ele("div") ;
         self._atta(row , "class" , "row") ;

         for ( x = 0 ; x < self.gridSettings.horizontal ; x++ )
            {
            var grid = self._ele("div") ;
            self._atta(grid , "class" , "grid") ;
            grid.style.width = self.gridSettings.size + "px" ;
            grid.style.height = self.gridSettings.size + "px" ;
            row.appendChild(grid) ;
            arr.push(0) ;
            }

         self.field.appendChild(row) ;
         self.gridSettings.matrix.push(arr) ;
         }
      } ,

   createStart : function() {
      var self = this ;
      self.popUp(function() { self.startGame(self) ; } , "green" , "START") ;
      } ,

   activateButtons : function() {
      var self = this ;

      self.levelSettings.keydown = function(event) {
         if ( self.levelSettings.alive ) { self.userMove(event) ; }
         } ;

      self.levelSettings.keyup = function(event) {
         if ( self.levelSettings.alive ) { if ( event.keyCode === self.command.codekey ) { self.startMoving() ; } }
         } ;

      window.addEventListener("keydown" , self.levelSettings.keydown) ;
      window.addEventListener("keyup" , self.levelSettings.keyup) ;
      } ,

   deactivateButtons : function() {
      var self = this ;
      window.removeEventListener("keydown" , self.levelSettings.keydown) ;
      window.removeEventListener("keyup" , self.levelSettings.keyup) ;
      } ,

   cursorHide : function() {
      var self = this ;

      if ( self.levelSettings.cursor )
         {
         self.field.style.cursor = "none" ;
         self.levelSettings.cursor = false ;
         }
      else
         {
         self.field.style.cursor = "initial" ;
         self.levelSettings.cursor = true ;
         }
      } ,

   BlockObj : function( e , n , c , w , h , m ) {
      var self = this ;

      self.element = e ;
      self.name = n ;
      self.color = c ;
      self.horizontal = w ;
      self.vertical = h ;
      self.matrixlist = m ;
      self.matrix = 0 ;
      self.rotate = function(direction) {
         var len = this.matrixlist.length ;
         if ( direction ) { this.matrix += 1 ; if ( this.matrix === len ) { this.matrix = 0 ; } }
         else { this.matrix -= 1 ; if ( this.matrix < 0 ) { this.matrix = len - 1 ; } }
         var width = this.horizontal ;
         var height = this.vertical ;
         this.horizontal = height ;
         this.vertical = width ;
         } ;
      } ,

   newBlock : function() {
      var self = this ;
      self.resetPosition() ;
      if ( self.main.nextblock === undefined ) { self.main.nextblock = self.selectRandom() ; }
      self.main.block = self.createBlock(self.main.nextblock) ;
      self.sendPosition(self.main.block.element) ;
      self.main.nextblock = self.selectRandom() ;
      self.addPreview(self.main.nextblock) ;
      } ,

   createBlock : function( nb ) {
      var self = this ;
      matrixlist = self.getMatrixList(nb.matrix , nb.grid_y , nb.grid_x) ;
      var block = self._ele("div") ;
      self._atta(block , "class" , "block") ;
      block.style.width = (self.gridSettings.size * nb.grid_x) + "px" ;
      block.style.height = (self.gridSettings.size * nb.grid_y) + "px" ;
      var obj = new self.BlockObj(block , nb.name , nb.color , nb.grid_x , nb.grid_y , matrixlist) ;
      self.fillBlock(obj) ;
      return obj ;
      } ,

   fillBlock : function( block ) {
      var self = this ;

      var y ;
      var x ;
      for ( y = 0 ; y < block.vertical ; y++ )
         {
         var row = self._ele("div") ;
         self._atta(row , "class" , "row") ;

         for ( x = 0 ; x < block.horizontal ; x++ )
            {
            if ( block.matrixlist[block.matrix][y][x] === 0 ) { var micro = self.microBlock(false , block.color) ; }
            else { var micro = self.microBlock(true , block.color) ; }
            row.appendChild(micro) ;
            }

         block.element.appendChild(row) ;
         }
      } ,

   microBlock : function( visibility , color ) {
      var self = this ;
      var micro = document.createElement("div") ;
      var micro_att_class = document.createAttribute("class") ;
      if ( visibility ) { var cl = "on" ; }
      else { var cl = "off" ; }
      micro_att_class.value = cl + " " + color ;
      micro.setAttributeNode(micro_att_class) ;
      micro.style.width = self.gridSettings.size + "px" ;
      micro.style.height = self.gridSettings.size + "px" ;
      return micro ;
      } ,

   addPreview : function( block ) {
      var self = this ;
      var previewblock = self.createBlock(block) ;
      var ch = self.preview.firstElementChild ;
      if ( ch ) { self.preview.removeChild(ch) ; }
      self.preview.appendChild(previewblock.element) ;
      } ,

   selectRandom : function() {
      var self = this ;
      var ran = Math.floor(Math.random() * self.blockList.length) ;
      return self.blockList[ran] ;
      } ,

   resetPosition : function() {
      var self = this ;
      self.position.vertical = 0 ;
      self.position.horizontal = Math.floor(self.gridSettings.horizontal / 2) ;
      } ,

   sendPosition : function( block ) {
      var self = this ;
      var rows = self.field.children[self.position.vertical] ;
      var grids = rows.children ;
      grids[self.position.horizontal].appendChild(block) ;
      } ,

   startMoving : function() {
      var self = this ;

      if ( self.position.movement === undefined )
         {
         self.position.movement = setInterval(function() { self.moveBlock(self) ; } , self.levelSettings.speed) ;
         }
      else { return false ; }
      } ,

   stopMoving : function() {
      var self = this ;
      clearInterval(self.position.movement) ;
      self.position.movement = undefined ;
      } ,

   moveBlock : function( self ) {
      if ( self.checkNextMove() )
         {
         self.position.vertical += 1 ;
         self.sendPosition(self.main.block.element) ;
         }
      else { self.endMove() ; }
      } ,

   moveBlockHorizontal : function( direction ) {
      var self = this ;

      if ( self.checkSideMove(direction) )
         {
         if ( direction ) { self.position.horizontal += 1 ; }
         else { self.position.horizontal -= 1 ; }
         self.sendPosition(self.main.block.element) ;
         }
      } ,

   endMove : function() {
      var self = this ;

      if ( self.position.vertical === 0 ) { self.gameOver() ; }
      else
         {
         self.stopMoving() ;
         self.removeBlock() ;
         self.updateMatrix() ;
         self.checkRowComplete() ;
         self.checkLevelComplete() ;
         self.newBlock() ;
         self.startMoving() ;
         }
      } ,

   removeBlock : function() {
      var self = this ;
      var par = self.main.block.element.parentElement ;
      par.removeChild(self.main.block.element) ;
      } ,

   checkNextMove : function() {
      var self = this ;

      var y ;
      var x ;
      var len_y = self.main.block.matrixlist[self.main.block.matrix].length ;
      for ( y = 0 ; y < len_y ; y++ )
         {
         var matrix_row = self.gridSettings.matrix[self.position.vertical + y + 1] ;
         if ( !matrix_row ) { return false ; }
         var block_row = self.main.block.matrixlist[self.main.block.matrix][y] ;
         var len_x = block_row.length ;
         for ( x = 0 ; x < len_x ; x++ )
            {
            if ( (matrix_row[self.position.horizontal + x] === 1) && (block_row[x] === 1) ) { return false ; }
            }
         }

      return true ;
      } ,

   checkSideMove : function( direction ) {
      var self = this ;

      if ( direction ) { var inc = 1 ; }
      else { var inc = -1 ; }

      var y ;
      var x ;
      var len_y = self.main.block.matrixlist[self.main.block.matrix].length ;
      for ( y = 0 ; y < len_y ; y++ )
         {
         var matrix_row = self.gridSettings.matrix[self.position.vertical + y] ;
         var block_row = self.main.block.matrixlist[self.main.block.matrix][y] ;
         var len_x = block_row.length ;
         for ( x = 0 ; x < len_x ; x++ )
            {
            var item = matrix_row[self.position.horizontal + x + inc] ;
            if ( (item !== 0) && (item !== 1) ) { return false ; }
            if ( (item === 1) && (block_row[x] === 1) ) { return false ; }
            }
         }

      return true ;
      } ,

   checkLevelComplete : function() {
      var self = this ;
      if ( self.score.knockouts >= 10 ) { self.levelComplete() ; }
      } ,

   startGame : function( self ) {
      self.removePopUp() ;
      self.cursorHide() ;
      self.newBlock() ;
      self.activateButtons() ;
      self.startMoving() ;
      } ,

   gameOver : function() {
      var self = this ;
      self.levelSettings.alive = false ;
      self.stopMoving() ;
      self.cursorHide() ;
      self.deactivateButtons() ;
      self.popUp(function() { self.resetGame(self) ; } , "red" , "GAME OVER") ;
      } ,

   levelComplete : function() {
      var self = this ;
      self.stopMoving() ;
      self.levelSettings.rank += 1 ;
      self.level.innerHTML = self.levelSettings.rank ;
      self.levelSettings.speed -= self.levelSettings.speedrate ;
      if ( self.levelSettings.speed <= 0 ) { self.levelSettings.speed = 20 ; }
      self.changeTheme() ;
      self.score.knockouts = 0 ;
      } ,

   resetGame : function( self ) {
      self.removePopUp() ;
      self._removeAllNodes(self.preview) ;
      self.main.nextblock = undefined ;
      self.main.block = undefined ;
      self._removeAllNodes(self.field) ;
      self._clearArray(self.gridSettings.matrix) ;
      self.command.func = undefined ;

      self.levelSettings.rank = 0 ;
      self.levelSettings.speed = 1020 ;
      self.levelSettings.theme = self.levelSettings.themelist[0] ;
      self.score.points = 0 ;
      self.level.innerHTML = 1 ;
      self.score_span.innerHTML = 0 ;

      self.changeTheme() ;
      self.levelSettings.alive = true ;
      self.buildGrid() ;
      self.createStart() ;
      } ,

   changeTheme : function() {
      var self = this ;

      if ( self.levelSettings.rank < self.levelSettings.themelist.length )
         {
         self.levelSettings.theme = self.levelSettings.themelist[self.levelSettings.rank] ; ;
         }

      self.changeClass(self.console) ;
      self.changeClass(self.field_wrap) ;
      self.changeClass(self.block_wrap) ;
      self.changeClass(self.score_wrap) ;
      } ,

   changeClass : function( th ) {
      var self = this ;
      var len = th.classList.length ;
      var cls = th.classList.item(len - 1) ;
      th.classList.remove(cls) ;
      th.classList.add(self.levelSettings.theme) ;
      } ,

   getMatrixList : function( matrixlist , y , x ) {
      var self = this ;

      var switcher = true ;
      var arr = [] ;
      var z ;
      var len = matrixlist.length ;
      for ( z = 0 ; z < len ; z++ )
         {
         if ( switcher ) { var m = self._getMatrix(matrixlist[z] , y , x) ; switcher = false ; }
         else { var m = self._getMatrix(matrixlist[z] , x , y) ; switcher = true ; }
         arr.push(m) ;
         }

      return arr ;
      } ,

   _getMatrix : function( matrix , grid_y , grid_x ) {
      var self = this ;

      var main_arr = [] ;
      matrix = matrix.split("") ;

      var y ;
      var x ;
      var z = 0 ;
      for ( y = 0 ; y < grid_y ; y++ )
         {
         var arr = [] ;

         for ( x = 0 ; x < grid_x ; x++ )
            {
            arr.push(Number(matrix[z])) ;
            z++ ;
            }

         main_arr.push(arr) ;
         }

      return main_arr ;
      } ,

   updateMatrix : function() {
      var self = this ;

      var y ;
      var x ;
      var len_y = self.main.block.matrixlist[self.main.block.matrix].length ;
      for ( y = 0 ; y < len_y ; y++ )
         {
         var block_row = self.main.block.matrixlist[self.main.block.matrix][y] ;
         var len_x = block_row.length ;
         for ( x = 0 ; x < len_x ; x++ )
            {
            if ( block_row[x] === 1 )
               {
               self.gridSettings.matrix[self.position.vertical + y][self.position.horizontal + x] = block_row[x] ;
               var micro = self.microBlock(true , self.main.block.color) ;
               var rows = self.field.children[self.position.vertical + y] ;
               var grids = rows.children ;
               grids[self.position.horizontal + x].appendChild(micro) ;
               }
            }
         }
      } ,

   
   addPoints : function( points ) {
      var self = this ;
      self.score.points += points ;
      self.score_span.innerHTML = self.score.points ;
      } ,

   checkRowComplete : function() {
      var self = this ;

      var totalrows = [] ;
      var y ;
      var x ;
      var len_y = self.gridSettings.matrix.length ;
      for ( y = 0 ; y < len_y ; y++ )
         {
         var z = 0 ;
         var row = self.gridSettings.matrix[y] ;
         var len_x = row.length ;
         for ( x = 0 ; x < len_x ; x++ )
            {
            if ( row[x] === 1 ) { z++ ; }
            }

         if ( z === self.gridSettings.horizontal ) { totalrows.push(y) ; }
         }

      var len = totalrows.length ;

      if ( len > 0 )
         {
         for ( x = 0 ; x < len ; x++ )
            {
            self.removeRow(totalrows[x]) ;
            }

         self.rowComplete(len) ;
         }
      } ,

   rowComplete : function( len ) {
      var self = this ;
      self.score.knockouts += len ;
      self.addPoints(len * self.score.row) ;
      if ( len === 4 ) { self.addPoints(self.score.quadra) ; }
      } ,

   removeRow : function( y ) {
      var self = this ;

      var matrix_row = self.gridSettings.matrix[y] ;
      var row = self.field.children[y] ;
      var x ;
      var len_x = matrix_row.length ;
      for ( x = 0 ; x < len_x ; x++ )
         {
         var ch = row.children[x] ;
         var block = ch.children[0] ;
         ch.removeChild(block) ;
         matrix_row[x] = 0 ;
         }

      var del = self.gridSettings.matrix.splice(y , 1) ;
      self.gridSettings.matrix.unshift(del[0]) ;
      self.field.insertBefore(row , self.field.children[0]) ;
      } ,

   userMove : function( event ) {
      var self = this ;
      self.stopMoving() ;
      event = event || window.event ;
      event.preventDefault() ;
      self.command.codekey = event.keyCode ;

      switch ( event.keyCode )
         {
         case 37 : self.moveHorizontal(false) ; break ;
         case 39 : self.moveHorizontal(true) ; break ; 
         case 40 : self.moveDown() ; break ; 
         case 78 : self.rotateBlock(false) ; break ; 
         case 77 : self.rotateBlock(true) ; break ;
         default : self.command.codekey = undefined ;
         }
      } ,

   moveHorizontal : function( direction ) {
      var self = this ;
      self.moveBlockHorizontal(direction) ;
      } ,

   moveDown : function() {
      var self = this ;
      self.moveBlock(self) ;
      } ,

   rotateBlock : function( direction ) {
      var self = this ;
      self._removeAllNodes(self.main.block.element) ;
      self.main.block.rotate(direction) ;
      self.main.block.element.style.width = (self.gridSettings.size * self.main.block.horizontal) + "px" ;
      self.main.block.element.style.height = (self.gridSettings.size * self.main.block.vertical) + "px" ;
      self.fillBlock(self.main.block) ;
      } ,

   popUp : function( func , color , text ) {
      var self = this ;

      var pop_wrap = self._ele("div") ;
         self._atta(pop_wrap , "class" , "pop_wrap") ;
         var pop = self._ele("div") ;
            self._atta(pop , "class" , "button " + color) ;
            self._txt(pop , text) ;

      pop_wrap.appendChild(pop) ;
      pop.addEventListener("click" , func , true) ;
      self.field_wrap.appendChild(pop_wrap) ;
      } ,

   removePopUp : function() {
      var self = this ;
      var pop_wrap = self.element.getElementsByClassName("pop_wrap")[0] ;
      var par = pop_wrap.parentElement ;
      par.removeChild(pop_wrap) ;
      } ,

   _ele : function( ele ) {
      var ta = document.createElement(ele) ;
      return ta ;
      } ,

   _atta : function( t , att , v ) {
      var a = document.createAttribute(att) ;
      a.value = v ;
      t.setAttributeNode(a) ;
      } ,

   _txt : function( t , txt ) {
      var m = document.createTextNode(txt) ;
      t.appendChild(m) ;
      } ,

   _removeAllNodes : function( e ) {
      while( e.firstChild ) { e.removeChild(e.firstChild) ; }
      } ,

   _clearArray : function( arr ) {
      while( arr.length ) { arr.pop() ; }
      }
   } ;

(function() {
   var game = new Game("game_wrap") ;
   })() ;
})() ;
