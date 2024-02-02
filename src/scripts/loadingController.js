const animationContainer = document.getElementById("loadingAnimationContainer");
const animation = document.getElementById("loadingAnimation");

let loading = true;

const loadAnimation=()=>{
	animation.innerHTML = "-____";
	setTimeout(() => {
		animation.innerHTML = "_-___";
	}, 100);
	setTimeout(() => {
		animation.innerHTML = "__-__";
	}, 300);
    setTimeout(()=>{
        animation.innerHTML='___-_';
    },500);
    setTimeout(()=>{
        animation.innerHTML='____-';
    },700);
    setTimeout(()=>{
        animation.innerHTML='_____';
        loading && setTimeout(loadAnimation,200);
    },800);
}
loadAnimation();