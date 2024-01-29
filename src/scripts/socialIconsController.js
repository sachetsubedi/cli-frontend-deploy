const shownIcon= document.getElementById('shownIcon');
const iconContainer=document.getElementById('iconsContainer');
shownIcon.addEventListener('click',()=>{
    document.querySelectorAll('.hidden-icons').forEach((e)=>{
        e.classList.contains('hidden')?
        e.classList.remove('hidden'):
        e.classList.add('hidden');
    })
    shownIcon.classList.contains('fa-at')?
    (shownIcon.classList.replace('fa-at','fa-xmark'),
    iconContainer.classList.add('px-3')):
    (shownIcon.classList.replace('fa-xmark','fa-at'),
    iconContainer.classList.remove('px-3'));
})