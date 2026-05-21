const imageArea = document.getElementById("imageArea");
const category = document.getElementById("category");

let isDrawing = false;
let startX = 0;
let startY = 0;
let currentBox = null;

let currentLanguage = "PT";

const translations = {
    PT: {
        pageTitle: "Simples Simulador de Marcação de Imagens",
        heroBadge: "Simulação • Data Annotation • IA",
        heroTitle: "Simples Simulador de Marcação de Imagens",
        heroDesc: "Experimente o fluxo básico utilizado em plataformas de annotation e computer vision. Crie bounding boxes e classifique objetos.",
        labelCategory: "Categoria do Objeto",
        btnClear: "Limpar Marcações",
        btnRedirect: "Conheça um Real",
        opt1: "Pessoa", opt2: "Carro", opt3: "Cachorro", opt4: "Árvore", opt5: "Construção",
        sideTitle1: "O que esta simulação representa?",
        sideDesc1: "Ferramentas de anotação de dados são usadas para identificar elementos em imagens, permitindo que modelos de IA aprendam padrões visuais.",
        li2: "Classificação de Objetos",
        li3: "Treinamento de IA",
        sideTitle2: "Diferenciais da Área",
        statFoco: "Foco", statFocoDesc: "Atenção total",
        statPrec: "Precisão", statPrecDesc: "Baixo erro",
        statOrg: "Organização", statOrgDesc: "Protocolos",
        statCons: "Consistência", statConsDesc: "Qualidade",
        modalTitle: "Detalhes dos Conceitos",
        modalBB: "São caixas retangulares desenhadas sobre objetos específicos dentro de uma imagem técnica. Elas servem para delimitar as coordenadas exatas de largura e altura do item analisado. É o método primário para ensinar sistemas de IA a localizarem estruturas no espaço visual.",
        modalCO: "Consiste no ato de atribuir uma etiqueta ou categoria específica para a região selecionada na imagem. Não basta apenas saber onde o objeto está localizado, o sistema precisa rotular o que ele representa. Isso categoriza se o elemento detectado é um carro, pessoa, animal ou placa.",
        modalTA: "É o processo repetitivo onde milhares de imagens previamente marcadas alimentam um algoritmo de rede neural. A máquina analisa os exemplos corretos para tentar deduzir as regras matemáticas visuais por conta própria. Quanto maior a qualidade das marcações humanas, mais inteligente e autônomo o modelo se torna.",
        modalCV: "Área da ciência da computação que desenvolve tecnologias para fazer softwares extraírem informações de mídias visuais. Ela busca simular o complexo sistema de interpretação de imagens que o olho e o cérebro humano realizam naturalmente. É a base tecnológica por trás de carros autônomos e reconhecimento facial."
    },
    EN: {
        pageTitle: "Simple Image Labeling Simulator",
        heroBadge: "Simulation • Data Annotation • AI",
        heroTitle: "Simple Image Labeling Simulator",
        heroDesc: "Experience the basic workflow used in annotation and computer vision platforms. Create bounding boxes and classify objects.",
        labelCategory: "Object Category",
        btnClear: "Clear Markings",
        btnRedirect: "Meet a Real One",
        opt1: "Person", opt2: "Car", opt3: "Dog", opt4: "Tree", opt5: "Building",
        sideTitle1: "What does this simulation represent?",
        sideDesc1: "Data annotation tools are used to identify elements in images, allowing AI models to learn visual patterns.",
        li2: "Object Classification",
        li3: "AI Training",
        sideTitle2: "Area Differentials",
        statFoco: "Focus", statFocoDesc: "Total attention",
        statPrec: "Precision", statPrecDesc: "Low error",
        statOrg: "Organization", statOrgDesc: "Protocols",
        statCons: "Consistency", statConsDesc: "Quality",
        modalTitle: "Concepts Details",
        modalBB: "These are rectangular boxes drawn over specific objects within a technical image. They serve to delimit the exact coordinates of the width and height of the analyzed item. It is the primary method for teaching AI systems how to locate structures in the visual space.",
        modalCO: "Consists of assigning a specific label or category to the selected region in the image. It is not enough to just know where the object is located, the system needs to label what it represents. This categorizes whether the detected element is a car, person, animal, or sign.",
        modalTA: "It is the repetitive process where thousands of previously marked images feed a neural network algorithm. The machine analyzes correct examples to try to deduce the visual mathematical rules on its own. The higher the quality of human markings, the smarter the model becomes.",
        modalCV: "An area of computer science that develops technologies to make software extract information from visual media. It seeks to simulate the complex system of interpreting images that the human eye and brain naturally perform. It is the technological base behind autonomous cars and facial recognition."
    }
};

function toggleLanguage() {
    currentLanguage = currentLanguage === "PT" ? "EN" : "PT";
    document.getElementById("langBtn").innerText = currentLanguage === "PT" ? "EN" : "PT";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[currentLanguage][key]) {
            if (element.tagName === "TITLE") {
                document.title = translations[currentLanguage][key];
            } else {
                element.innerText = translations[currentLanguage][key];
            }
        }
    });

    updateSelectOptionsValue();
}

function updateSelectOptionsValue() {
    const options = category.options;
    if(currentLanguage === "PT") {
        options[0].value = "Pessoa"; options[1].value = "Carro"; options[2].value = "Cachorro"; options[3].value = "Árvore"; options[4].value = "Construção";
    } else {
        options[0].value = "Person"; options[1].value = "Car"; options[2].value = "Dog"; options[3].value = "Tree"; options[4].value = "Building";
    }
}

const modalOverlay = document.getElementById("modalOverlay");

function openModal() {
    modalOverlay.classList.add("active");
}

function closeModal(e) {
    if (e.target === modalOverlay || e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
        modalOverlay.classList.remove("active");
    }
}

function getCoordinates(e) {
    const rect = imageArea.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        widthPx: rect.width,
        heightPx: rect.height
    };
}

function startDrawing(e) {
    if(e.type === "touchstart") e.preventDefault(); 
    
    isDrawing = true;
    const coords = getCoordinates(e);
    
    startX = coords.x;
    startY = coords.y;

    currentBox = document.createElement("div");
    currentBox.classList.add("box");
    
    currentBox.dataset.startX = startX;
    currentBox.dataset.startY = startY;

    currentBox.style.left = ((startX / coords.widthPx) * 100) + "%";
    currentBox.style.top = ((startY / coords.heightPx) * 100) + "%";

    imageArea.appendChild(currentBox);
}

function draw(e) {
    if(!isDrawing) return;

    const coords = getCoordinates(e);
    const currentX = coords.x;
    const currentY = coords.y;

    const width = currentX - startX;
    const height = currentY - startY;

    const leftPercent = ((width < 0 ? currentX : startX) / coords.widthPx) * 100;
    const topPercent = ((height < 0 ? currentY : startY) / coords.heightPx) * 100;
    const widthPercent = (Math.abs(width) / coords.widthPx) * 100;
    const heightPercent = (Math.abs(height) / coords.heightPx) * 100;

    currentBox.style.width = widthPercent + "%";
    currentBox.style.height = heightPercent + "%";
    currentBox.style.left = leftPercent + "%";
    currentBox.style.top = topPercent + "%";
}

function endDrawing() {
    if(!isDrawing) return;
    isDrawing = false;

    if(parseFloat(currentBox.style.width) < 1 || parseFloat(currentBox.style.height) < 1) {
        currentBox.remove();
        return;
    }

    const label = document.createElement("div");
    label.classList.add("label");
    label.innerText = category.value;

    currentBox.appendChild(label);
}

imageArea.addEventListener("mousedown", startDrawing);
imageArea.addEventListener("mousemove", draw);
window.addEventListener("mouseup", endDrawing);

imageArea.addEventListener("touchstart", startDrawing, {passive: false});
imageArea.addEventListener("touchmove", draw, {passive: false});
window.addEventListener("touchend", endDrawing);

function clearBoxes(){
    document.querySelectorAll(".box").forEach(box => box.remove());
}