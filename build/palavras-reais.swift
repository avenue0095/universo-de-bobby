// Gera src/conteudo/palavras-reais.js: quais variações das palavras do banco (PALAVRAS_BASE de src/conteudo/basicas.js) são palavras REAIS
// em português, conferidas no corretor ortográfico pt_BR do macOS (NSSpellChecker). Roda só no Mac, offline, sem custo:
//   swift build/palavras-reais.swift
// Variações testadas: cada letra trocada por qualquer letra de a a z (e ç), cada letra tirada, cada letra dobrada, letras vizinhas trocadas
// e sílabas trocadas de lugar. O app usa a lista para nunca oferecer como "errado" algo que é palavra de verdade (BALA no lugar de BOLA)
// e para só abrir lacuna onde uma única letra forma palavra.
import AppKit
import Foundation
let raiz = URL(fileURLWithPath: CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : FileManager.default.currentDirectoryPath)
let fonte = try! String(contentsOf: raiz.appendingPathComponent("src/conteudo/basicas.js"), encoding: .utf8)
// palavras e sílabas do banco: {p:'bola',s:['bo','la']}
let re = try! NSRegularExpression(pattern: "\\{p:'([a-zçãõáéíóúâêô]+)',s:\\[([^\\]]+)\\]\\}")
var base: [(String, [String])] = []
for m in re.matches(in: fonte, range: NSRange(fonte.startIndex..., in: fonte)) {
  let p = String(fonte[Range(m.range(at: 1), in: fonte)!])
  let s = String(fonte[Range(m.range(at: 2), in: fonte)!]).replacingOccurrences(of: "'", with: "").split(separator: ",").map(String.init)
  base.append((p, s))
}
let letras = Array("abcdefghijklmnopqrstuvwxyzç")
var cand = Set<String>()
for (p, s) in base {
  let a = Array(p)
  for i in 0..<a.count {
    for l in letras { var b = a; b[i] = l; cand.insert(String(b)) }
    var d = a; d.remove(at: i); cand.insert(String(d))
    var e = a; e.insert(a[i], at: i); cand.insert(String(e))
    if i + 1 < a.count { var f = a; f.swapAt(i, i + 1); cand.insert(String(f)) }
  }
  if s.count >= 2 { var t = s; t.swapAt(0, 1); cand.insert(t.joined()); var u = s; u.swapAt(s.count - 2, s.count - 1); cand.insert(u.joined()) }
}
let sc = NSSpellChecker.shared
var reais = Set(base.map { $0.0 })
// a lista atual entra junto: regenerar SOMA palavras (o corretor de outra versão do macOS pode não conhecer alguma), nunca tira
let destino = raiz.appendingPathComponent("src/conteudo/palavras-reais.js")
var antigas = 0
if let atual = try? String(contentsOf: destino, encoding: .utf8), let ini = atual.range(of: "new Set(["), let fim = atual.range(of: "]);", range: ini.upperBound..<atual.endIndex) {
  for w in atual[ini.upperBound..<fim.lowerBound].split(separator: ",") { let p = w.trimmingCharacters(in: CharacterSet(charactersIn: "' ")); if !p.isEmpty { reais.insert(p); antigas += 1 } }
}
for w in cand.sorted() where w.count >= 2 {
  let r = sc.checkSpelling(of: w, startingAt: 0, language: "pt_BR", wrap: false, inSpellDocumentWithTag: 0, wordCount: nil)
  if r.location == NSNotFound { reais.insert(w) }
}
let lista = reais.sorted().map { "'\($0)'" }.joined(separator: ",")
let so = ProcessInfo.processInfo.operatingSystemVersion
let versao = "\(so.majorVersion).\(so.minorVersion).\(so.patchVersion)"
let fmt = DateFormatter(); fmt.dateFormat = "yyyy-MM-dd"; let data = fmt.string(from: Date())
let js = "/* GERADO por build/palavras-reais.swift (corretor pt_BR do macOS \(versao), em \(data)). Não edite à mão.\n   Variações das palavras do banco que SÃO palavras reais: nunca viram opção \"errada\" nem lacuna ambígua. \(cand.count) variações testadas;\n   a lista anterior (\(antigas) palavras) foi somada, nunca substituída. */\nconst PALAVRAS_REAIS=new Set([\(lista)]);\n"
try! js.write(to: destino, atomically: true, encoding: .utf8)
print("palavras-reais.js: \(reais.count) reais de \(cand.count) variações (\(base.count) palavras do banco)")
