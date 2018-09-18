const app = {}

$(function() {
    app.init();
})

app.init = () => {
    app.eventListener();
    app.generateGrid();
    
    if ($(window).width() > 1280) {
        app.gameTimer();   
    }
}

app.eventListener = () => {
    app.windowResize();
}

app.windowResize = () => {
    $(window).resize(() => {
        app.generateGrid();
        
        app.allGrids = []
        app.stacked = new Set();
        app.unStacked = [];
    
        app.ranGrid();
    })
}

app.gameTimer = () => {
    app.allGrids = []
    app.stacked = new Set();
    app.unStacked = [];

    let color1 = "#e3edff";
    let color2 = "#e3edff78"


    app.ranGrid();

    const interval = setInterval(() => {
        if (app.allGrids) {
            app.gravity(color1, color2);
        }
        
        if (app.unStacked.length === 0) {
            const temp = color1;
            color1 = color2;
            color2 = temp;
            // clearInterval(interval);
            app.unStacked = [];
            app.ranGrid();
            app.stacked.clear();
        }

        app.generateOneGrid();
    }, 100);
}

app.ranGrid = () => {
    // Creating list of unstacked blocks
    for (let i = 0; i < app.numCols; i++) {
        for (let j = 0; j < app.numRows; j++) {
            app.unStacked.push(i);
        }
    }

    // Randomizing the order
    app.unStacked.sort(() => 0.5 - Math.random());
}


app.generateOneGrid = () => {
    const randomGrid = app.unStacked[0];
    app.allGrids.push(randomGrid)

    app.unStacked.shift();

    $(`header .gameScreen .grid${randomGrid}`)
        .css("background-color", "#e3edff78")
}

app.gravity = (color1, color2) => {

    app.allGrids.forEach((grid, i) => {
        const nextGrid = grid + app.numCols;
        if (grid < app.grids - app.numCols - 1 && !app.stacked.has(nextGrid)) {
            $(`header .gameScreen .grid${grid}`)
                .css("background-color", color1);
                
            app.allGrids.splice(i, 1, nextGrid);
            
            $(`header .gameScreen .grid${nextGrid}`)
                .css("background-color", color2);
                // .css("background-color", "black");
        } else {
            app.stacked.add(grid);
            app.allGrids.splice(i, 1);
        }       
    })
}

app.ran = (num) => Math.floor(Math.random() * num);

app.generateGrid = () => {
    const winWidth = $(window).width();
    const winHeight = $(window).height();
    
    const gridWidth = 80;
    const gridHeight = gridWidth;

    const numCols = Math.floor(winWidth / gridWidth);
    const numRows = Math.floor(winHeight / gridHeight);

    app.grids = numCols * numRows;
    app.numCols = numCols;
    app.numRows = numRows;

    $(".gameScreen")
            .empty()
            .css({
                "grid-template-columns": `repeat(${numCols}, ${gridWidth}px)`,
                "grid-template-rows": `repeat(${numRows}, ${gridWidth}px)`
            });

    for (let i = 0; i < app.grids; i++) {
        const grid= $("<div>").addClass(`grid grid${i}`)   

        $(".gameScreen").append(grid)
    }
}