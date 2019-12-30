module.exports = (text) => {
  const charConvertObj = {A:"А",B:"Б",V:"В",G:"Г",D:"Д",Ye:"Е",Yo:"Ё",J:"Ж",C:"К",Z:"З",I:"И",Y:"Й",K:"К",L:"Л",M:"М",N:"Н",O:"О",P:"П",R:"Р",S:"С",T:"Т",U:"У",F:"Ф",X:"Х",TS:"Ц",Ch:"Ч",Sh:"Ш",Q:"Қ","G'":"Ғ","O'":"Ў",H:"Ҳ","'":"ъ",E:"Э",Yu:"Ю",Ya:"Я",a:"а",b:"б",v:"в",g:"г",d:"д",e:"е",yo:"ё",j:"ж",c:"к",z:"з",i:"и",y:"й",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",r:"р",s:"с",t:"т",u:"у",f:"ф",x:"х",ts:"ц",ch:"ч",sh:"ш",q:"қ","g'":"ғ","o'":"ў",h:"ҳ",yu:"ю",ya:"я"};
  const ignoreStrings = {};
  text = text.replace(/```(.*?)```/g, (_, text, offset) => {
    ignoreStrings[offset] = text;
    return `%${offset}%`;
  });
  const charArr = text.split('');
  let result = '';

  let count = 0;
  charArr.forEach(function(textChar, i, charArr){
    let char = textChar;
    if(charConvertObj[char] !== undefined){
      if (count === 1) {
        count = 0;
      }else{
        switch (char) {
          case 'T':
            if (charArr[i+1] === 'S' || charArr[i+1] === 's') {
              char = 'TS';
              count = 1;
            }
            break;
          case 't':
            if (charArr[i+1] === 'S' || charArr[i+1] === 's') {
              char = 'ts';
              count = 1;
            }
            break;
          case 'O':
            if (charArr[i+1] === '\'') {
              char = 'O\'';
              count = 1;
            }
            break;
          case 'o':
            if (charArr[i+1] === '\'') {
              char = 'o\'';
              count = 1;
            }
            break;
          case 'G':
            if (charArr[i+1] === '\'') {
              char = 'G\'';
              count = 1;
            }
            break;
          case 'g':
            if (charArr[i+1] === '\'') {
              char = 'g\'';
              count = 1;
            }
            break;
          case 'Y':
            if (charArr[i+1] === 'a' || charArr[i+1] === 'A') {
              char = 'Ya';
              count = 1;
            } else if (charArr[i+1] === 'o' || charArr[i+1] === 'O') {
              char = 'Yo';
              count = 1;
            } else if (charArr[i+1] === 'u' || charArr[i+1] === 'U') {
              char = 'Yu';
              count = 1;
            } else if (charArr[i+1] === 'e' || charArr[i+1] === 'E') {
              char = 'Ye';
              count = 1;
            }
            break;
          case 'y':
            if (charArr[i+1] === 'a' || charArr[i+1] === 'A') {
              char = 'ya';
              count = 1;
            } else if (charArr[i+1] === 'o' || charArr[i+1] === 'O') {
              char = 'yo';
              count = 1;
            } else if (charArr[i+1] === 'u' || charArr[i+1] === 'U') {
              char = 'yu';
              count = 1;
            } else if (charArr[i+1] === 'e' || charArr[i+1] === 'E') {
              char = 'ye';
              count = 1;
            }
            break;
          case 'S':
            if (charArr[i+1] === 'h' || charArr[i+1] === 'H') {
              char = 'Sh';
              count = 1;
            }
            break;
          case 's':
            if (charArr[i+1] === 'h' || charArr[i+1] === 'H') {
              char = 'sh';
              count = 1;
            }
            break;
          case 'C':
            if (charArr[i+1] === 'h' || charArr[i+1] === 'H') {
              char = 'Ch';
              count = 1;
            }
            break;
          case 'c':
            if (charArr[i+1] === 'h' || charArr[i+1] === 'H') {
              char = 'ch';
              count = 1;
            }
            break;
          default:
        }
        
        result += charConvertObj[char];
      }
    }else{
      result += char;
    }
    
  });
  Object.keys(ignoreStrings).forEach(key => {
  	result = result.replace(`%${key}%`, ignoreStrings[key]);
  });
  return result;
}