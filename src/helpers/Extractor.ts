export function Extract(data:Array<any>,propertie:string){
      const extractedData = data
        .map(v => v[propertie])           
        .filter(Boolean);       
      return extractedData;
}


export default function ExtractWithoutRepetition(data,propertie){
    const extractedData = Extract(data,propertie);
    const uniqueData = Array.from(new Set(extractedData)); // إزالة التكرار
    return uniqueData
}