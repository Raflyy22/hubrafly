let answer=0;
export function createCaptcha(el){
  const a=Math.floor(Math.random()*9)+1,b=Math.floor(Math.random()*9)+1;
  answer=a+b; el.textContent=`${a} + ${b} = ?`; return answer;
}
export function captchaValid(value){return Number(value)===answer}
