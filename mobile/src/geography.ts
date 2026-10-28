import { content, type Language } from "./content";
const rows = `上海浦东国际机场|Shanghai Pudong International Airport|上海浦東国際空港|상하이 푸둥 국제공항
上海虹桥国际机场|Shanghai Hongqiao International Airport|上海虹橋国際空港|상하이 훙차오 국제공항
北京首都国际机场|Beijing Capital International Airport|北京首都国際空港|베이징 서우두 국제공항
北京大兴国际机场|Beijing Daxing International Airport|北京大興国際空港|베이징 다싱 국제공항
广州白云国际机场|Guangzhou Baiyun International Airport|広州白雲国際空港|광저우 바이윈 국제공항
深圳宝安国际机场|Shenzhen Bao'an International Airport|深圳宝安国際空港|선전 바오안 국제공항
成都天府国际机场|Chengdu Tianfu International Airport|成都天府国際空港|청두 톈푸 국제공항
成都双流国际机场|Chengdu Shuangliu International Airport|成都双流国際空港|청두 솽류 국제공항
杭州萧山国际机场|Hangzhou Xiaoshan International Airport|杭州蕭山国際空港|항저우 샤오산 국제공항
厦门高崎国际机场|Xiamen Gaoqi International Airport|厦門高崎国際空港|샤먼 가오치 국제공항
昆明长水国际机场|Kunming Changshui International Airport|昆明長水国際空港|쿤밍 창수이 국제공항
青岛胶东国际机场|Qingdao Jiaodong International Airport|青島膠東国際空港|칭다오 자오둥 국제공항
南京禄口国际机场|Nanjing Lukou International Airport|南京禄口国際空港|난징 루커우 국제공항
重庆江北国际机场|Chongqing Jiangbei International Airport|重慶江北国際空港|충칭 장베이 국제공항
西安咸阳国际机场|Xi'an Xianyang International Airport|西安咸陽国際空港|시안 셴양 국제공항
桂林两江国际机场|Guilin Liangjiang International Airport|桂林両江国際空港|구이린 량장 국제공항
广深港高铁西九龙站|Hong Kong West Kowloon Station|香港西九龍駅|홍콩 서구룡역
蛇口港|Shekou Port|蛇口港|서커우항
北京站|Beijing Railway Station|北京駅|베이징역
北京南站|Beijing South Railway Station|北京南駅|베이징 남역
北京西站|Beijing West Railway Station|北京西駅|베이징 서역
北京朝阳站|Beijing Chaoyang Railway Station|北京朝陽駅|베이징 차오양역
上海站|Shanghai Railway Station|上海駅|상하이역
上海南站|Shanghai South Railway Station|上海南駅|상하이 남역
上海虹桥站|Shanghai Hongqiao Railway Station|上海虹橋駅|상하이 훙차오역
西安北站|Xi'an North Railway Station|西安北駅|시안 북역
西安站|Xi'an Railway Station|西安駅|시안역
成都东站|Chengdu East Railway Station|成都東駅|청두 동역
成都站|Chengdu Railway Station|成都駅|청두역
成都南站|Chengdu South Railway Station|成都南駅|청두 남역
杭州东站|Hangzhou East Railway Station|杭州東駅|항저우 동역
杭州站|Hangzhou Railway Station|杭州駅|항저우역
杭州西站|Hangzhou West Railway Station|杭州西駅|항저우 서역
桂林北站|Guilin North Railway Station|桂林北駅|구이린 북역
桂林站|Guilin Railway Station|桂林駅|구이린역
桂林西站|Guilin West Railway Station|桂林西駅|구이린 서역
广州南站|Guangzhou South Railway Station|広州南駅|광저우 남역
广州站|Guangzhou Railway Station|広州駅|광저우역
广州东站|Guangzhou East Railway Station|広州東駅|광저우 동역
深圳北站|Shenzhen North Railway Station|深圳北駅|선전 북역
福田站|Futian Railway Station|福田駅|푸톈역
深圳站|Shenzhen Railway Station|深圳駅|선전역`;
const names = new Map(
  rows.split("\n").map((row) => {
    const [zh, en, ja, ko] = row.split("|");
    return [zh, { zh, en, ja, ko }];
  }),
);
export function locationLabel(name: string, language: Language) {
  const match = /^(.*?)[（(]([A-Z]{3})[）)]$/.exec(name);
  const base = match ? match[1] : name;
  return (
    (names.get(base)?.[language] || base) + (match ? ` (${match[2]})` : "")
  );
}
export function cityLabel(name: string, language: Language) {
  const norm = (value: string) => value.toLowerCase().replace(/[’'\s]/g, "");
  const city = content.cityLabels.find((c) => norm(c.city) === norm(name));
  return city ? (language === "en" ? city.city : city[language]) : name;
}
