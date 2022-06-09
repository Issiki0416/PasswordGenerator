/*パスワード表示箇所*/
const resultEl = <HTMLSpanElement>document.getElementById("result");
// チェックボックス要素を取得
const lengthEl = <HTMLInputElement>document.getElementById("length");
const uppercaseEl = <HTMLInputElement>document.getElementById("uppercase");
const lowercaseEl = <HTMLInputElement>document.getElementById("lowercase");
const numbersEl = <HTMLInputElement>document.getElementById("numbers");
const specialEl = <HTMLInputElement>document.getElementById("special");
// パスワード生成ボタンを取得
const generateEl = <HTMLButtonElement>document.getElementById("generate");

// チェックボックスのチェック状態を取得
const randomFunc = {
  hasLower: getRandomLower,
  hasUpper: getRandomUpper,
  hasNumber: getRandomNumber,
  hasSpecial: getRandomSpecial
};

generateEl.addEventListener("click", () => {
  const length:string = lengthEl.value;
  //lengthをnumber型に変換
  const lengthNum:number = +length;
  //チェックを全てチェックしていない場合、パスワードを生成しない
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numbersEl.checked;
  const hasSpecial = specialEl.checked;
  // 選択されたものがbooleamで1,1,1,1とかえる
  resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSpecial, lengthNum);
});
function generatePassword(lower: boolean,upper: boolean,number: boolean,special: boolean,length: number){
    let generatePassword = "";
    // eslint-disable-next-line no-irregular-whitespace
    //　真偽値をnumber型に変換
    const hasLower = lower ? 1 : 0;
    const hasUpper = upper ? 1 : 0;
    const hasNumber = number ? 1 : 0;
    const hasSpecial = special ? 1 : 0;

    // const typesCount = hasLower + hasUpper + hasNumber + hasSpecial;
    const typesBoolArray = [{hasLower},{hasUpper},{hasNumber},{hasSpecial}];
    const typesArr = typesBoolArray.filter(item => Object.values(item)[0]);
    // 選択されたものが配列の中にオブジェクトとして格納されている

    //もし、パスワードの長さが0なら、空文字を返す
    if(length < 1){
        return "";
    }
    //パスワードの長さが0以上なら、パスワードを生成する
    for(let i = 0; i < length; i++){
        typesArr.forEach(type => { 
          const funcName = Object.keys(type)[0];
          // rendomFuncのキーに対応する関数を実行する
          //@ts-ignore
          generatePassword += randomFunc[funcName]();
        });
    }
    const finalPassword = generatePassword.slice(0,length);
    return finalPassword;
}

/* RandomFuncにオブジェクトとして渡す関数を定義 */
function getRandomLower(){
  return String.fromCharCode(Math.floor(Math.random()*26)+97);
}
//65から大文字がはじまる
function getRandomUpper(){
  return String.fromCharCode(Math.floor(Math.random()*26)+65);
}
function getRandomNumber(){
  return String.fromCharCode(Math.floor(Math.random()*10)+48);
}
function getRandomSpecial(){
  const special = "!@#$%^&*()_+{}[]|\\:;'<>?,./";
  return special[Math.floor(Math.random()*special.length)];
}
/** クリップボードへ保存処理  ***/

const $clipboard:any = $("#clipboard");
$clipboard
// tooltip設定
.tooltip({
    trigger: 'manual'
})
// tooltip表示後の動作を設定
.on('shown.bs.tooltip', function(){
    setTimeout((function(){
    $clipboard.tooltip('hide');
    }).bind($clipboard), 1500);
})
// クリック時の動作を設定
.on('click', function(){
    // buttonのvalueを取得
    const text =  resultEl.innerText;
    if(!text){
        return;
    }
    // tdから直接はコピーできないためテキストエリアを経由
    const $textarea = $('<textarea></textarea>');
    $textarea.text(text);
    
    $clipboard.append($textarea);
    $textarea.select();
    // コピー結果を取得してtextareaは削除
    const copyResult = document.execCommand('copy');
    $textarea.remove();
    // コピー結果によって表示変更
    if(copyResult){
        $('#clipboard').attr('data-original-title', 'コピーしました');
    }
    
    $clipboard.tooltip('show');
});
