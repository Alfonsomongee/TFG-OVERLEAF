import os
import re

I18N_DIR = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"
LANGS = ["en", "fr", "de", "it", "pt"]

tables_by_lang = {
    "en": {
        "text1": "Several arguments contain **verifiable inconsistencies** with the technical reports, as summarized in Table 2.",
        "table1": """<ForensicTable
  title="TABLE 2 | FACT-CHECK: MEDIA CRITICAL OF INSTITUTIONAL MANAGEMENT"
  source="Own compilation (contrast with ENTSO-E / IIT-ICAI / REE expert reports)"
>
  <table>
    <thead>
      <tr>
        <th>Outlet</th>
        <th>Published Claim</th>
        <th>Contrast with Technical Consensus (Expert Reports)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ABC</strong></td>
        <td>The network was on the brink of collapse due to the «alarming lack of rotational inertia caused by shut-down nuclear plants».</td>
        <td><strong>Direct contradiction</strong>. Official records certify that system inertia was H = 2.3 s at the moment of collapse, above the ENTSO-E recommended threshold. The event was not an inertia-deficit collapse but a capacitive instability phenomenon.</td>
      </tr>
      <tr>
        <td><strong>El Mundo</strong></td>
        <td>«Flamanville 3 and France's 56 nuclear plants that saved anti-nuclear Sánchez during the great blackout», implicitly attributing supply restoration to nuclear technology.</td>
        <td><strong>Imprecision</strong>. France's role in restoration was indeed significant (4,500 MW of support), but recovery was also underpinned by hydroelectric black start and Moroccan support, with nuclear generation as one of several factors.</td>
      </tr>
      <tr>
        <td><strong>La Razón</strong></td>
        <td>A preliminary report concluding that «the scheduling of insufficient synchronous generation with dynamic voltage control was the cause of the blackout».</td>
        <td><strong>Partial support</strong>. The reactive power absorption deficit in the southern zone was a documented factor (IIT-ICAI), but the same report notes that this deficit occurred in the context of the System Operator's meshing manoeuvres — a factor the coverage did not incorporate.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>""",
        "text2": "Some arguments are **technically consistent** with the reports, while others introduce significant deviations (see Table 3):",
        "table2": """<ForensicTable
  title="TABLE 3 | FACT-CHECK: MEDIA FAVOURABLE TO THE INSTITUTIONAL NARRATIVE"
  source="Own compilation (contrast with ENTSO-E / IIT-ICAI / REE expert reports)"
>
  <table>
    <thead>
      <tr>
        <th>Outlet</th>
        <th>Published Claim</th>
        <th>Contrast with Technical Consensus (Expert Reports)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>El País</strong></td>
        <td>Exchange capacity with France stands at 3%, far below the EU 15% target.</td>
        <td><strong>Consistent</strong>. Greater interconnection capacity would have reduced the probability and severity of inter-area oscillations.</td>
      </tr>
      <tr>
        <td><strong>elDiario.es</strong></td>
        <td>REE operated with reduced security margins despite forecasts of high solar irradiance and low synchronous generation.</td>
        <td><strong>Consistent</strong>. Consistent with the reactive power deficit diagnosis in the south, though the coverage did not articulate the underlying Q-V curve saturation mechanism.</td>
      </tr>
      <tr>
        <td><strong>La Vanguardia</strong></td>
        <td>The transpyrenean line opening was an «egotistical» act by continental mechanisms to safeguard French supply.</td>
        <td><strong>Deviation/Contradiction</strong>. Contradicts ENTSO-E's assessment: the 12:33:21 CEST opening was the automatic actuation of Out-of-Step (OST) loss-of-synchronism protections in response to severe angular divergence. Attributing deliberate intent to an automatic protection mechanism confuses system protection operation with conscious operational decision-making.</td>
      </tr>
      <tr>
        <td><strong>infoLibre</strong></td>
        <td>Private operators «deliberately» failed to absorb excess voltage.</td>
        <td><strong>Deviation</strong>. Incorporates the Government's «technical indiscipline» accusation but omits chronologically the first factor: the System Operator's meshing manoeuvre that injected capacitive reactive power into the network before any trip occurred.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>"""
    },
    "de": {
        "text1": "Einige der vorgebrachten Argumente weisen **überprüfbare Inkonsistenzen** mit den technischen Berichten auf, wie in Tabelle 2 zusammengefasst.",
        "table1": """<ForensicTable
  title="TABELLE 2 | FACT-CHECK: MEDIEN, DIE DER INSTITUTIONELLEN FÜHRUNG KRITISCH GEGENÜBERSTEHEN"
  source="Eigene Ausarbeitung (Abgleich mit Gutachten von ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Medium</th>
        <th>Veröffentlichte Behauptung</th>
        <th>Abgleich mit dem technischen Konsens (Sachverständigenberichte)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ABC</strong></td>
        <td>Das Netz habe sich „um Haaresbreite“ vor dem Kollaps befunden, aufgrund eines „alarmierenden Mangels an Rotationsmassenträgheit, verursacht durch die abgeschalteten Kernkraftwerke“.</td>
        <td><strong>Direkter Widerspruch</strong>. Die Aufzeichnungen bestätigen, dass die Systemträgheit zum Zeitpunkt des Kollapses bei H = 2,3 s lag, über dem von ENTSO-E empfohlenen Schwellenwert. Das Ereignis war kein Kollaps aufgrund eines Defizits an synchroner Masse, sondern ein Phänomen der kapazitiven Instabilität.</td>
      </tr>
      <tr>
        <td><strong>El Mundo</strong></td>
        <td>„Flamanville 3 und die 56 französischen Kernkraftwerke, die den Anti-Atomkraft-Anhänger Sánchez während des großen Stromausfalls retteten“, was die Wiederherstellung implizit der Kernenergie zuschreibt.</td>
        <td><strong>Ungenauigkeit</strong>. Die Rolle Frankreichs bei der Wiederherstellung war relevant (4.500 MW an Unterstützung), aber die Wiederherstellung wurde auch durch den autonomen Start von Wasserkraftwerken und Unterstützung aus Marokko bewerkstelligt, wobei die Kerntechnik nur einer von mehreren Faktoren war.</td>
      </tr>
      <tr>
        <td><strong>La Razón</strong></td>
        <td>Ein vorläufiger Bericht kam zu dem Schluss, dass „die Einplanung von unzureichender Synchronerzeugung mit dynamischer Spannungsregelung die Ursache für den Stromausfall war“.</td>
        <td><strong>Teilweise Unterstützung</strong>. Das Defizit an Absorptionskapazität für Blindleistung in der südlichen Zone war ein dokumentierter Faktor (IIT-ICAI), aber derselbe Bericht weist darauf hin, dass dieses Defizit im Kontext der Vermaschungsmanöver des Systembetreibers auftrat — ein Faktor, den die Berichterstattung nicht einbezog.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>""",
        "text2": "Einige Argumente sind **technisch konsistent** mit den Berichten, während andere signifikante Abweichungen aufweisen (siehe Tabelle 3):",
        "table2": """<ForensicTable
  title="TABELLE 3 | FACT-CHECK: MEDIEN MIT GÜNSTIGER HALTUNG ZUM INSTITUTIONELLEN NARRATIV"
  source="Eigene Ausarbeitung (Abgleich mit Gutachten von ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Medium</th>
        <th>Veröffentlichte Behauptung</th>
        <th>Abgleich mit dem technischen Konsens (Sachverständigenberichte)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>El País</strong></td>
        <td>Die Austauschkapazität mit Frankreich liegt bei 3 %, weit unter dem europäischen Ziel von 15 %.</td>
        <td><strong>Konsistent</strong>. Wäre eine größere Verbindungskapazität vorhanden gewesen, wären die Wahrscheinlichkeit und Heftigkeit der Inter-Area-Schwingungen geringer gewesen.</td>
      </tr>
      <tr>
        <td><strong>elDiario.es</strong></td>
        <td>REE operierte mit reduzierten Sicherheitsmargen trotz der Vorhersage hoher Sonneneinstrahlung und geringer Synchronerzeugung.</td>
        <td><strong>Konsistent</strong>. Stimmt mit der Diagnose des Blindleistungsdefizits im Süden überein, obwohl die Berichterstattung den zugrunde liegenden technischen Mechanismus der Sättigung der Q-V-Kurven nicht artikulierte.</td>
      </tr>
      <tr>
        <td><strong>La Vanguardia</strong></td>
        <td>Die transpyrenäische Öffnung wird als „egoistisches“ Handeln der kontinentalen Mechanismen beschrieben, um die Versorgung in Frankreich zu sichern.</td>
        <td><strong>Abweichung/Widerspruch</strong>. Steht im Widerspruch zum Gutachten von ENTSO-E: Die Öffnung um 12:33:21 MESZ war die automatische Auslösung der Schutzvorrichtungen gegen Synchronismusverlust (OST) angesichts einer schwerwiegenden Winkeldivergenz. Einer automatischen Schutzeinrichtung Absicht zu unterstellen, zeugt von einer Verwechslung zwischen Systemfunktion und bewusster operativer Entscheidung.</td>
      </tr>
      <tr>
        <td><strong>infoLibre</strong></td>
        <td>Private Betreiber hätten „absichtlich“ dabei versagt, die überschüssige Spannung zu absorbieren.</td>
        <td><strong>Abweichung</strong>. Übernimmt den Vorwurf der Regierung wegen technischer Disziplinlosigkeit, lässt jedoch chronologisch den ersten Faktor weg: das Vermaschungsmanöver, das kapazitive Blindleistung in das Netz einspeiste, bevor es zu einer Auslösung kam.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>"""
    },
    "fr": {
        "text1": "Certains des arguments présentés contiennent des **incohérences vérifiables** avec les rapports techniques, comme résumé dans le Tableau 2.",
        "table1": """<ForensicTable
  title="TABLEAU 2 | FACT-CHECK: MÉDIAS CRITIQUES À L'ÉGARD DE LA GESTION INSTITUTIONNELLE"
  source="Élaboration propre (contraste avec les rapports d'expertise de l'ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Média</th>
        <th>Allégation publiée</th>
        <th>Contraste avec le consensus technique (Rapports d'expertise)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ABC</strong></td>
        <td>Le réseau était « à un cheveu » de s'effondrer en raison du « manque alarmant d'inertie de rotation provoqué par l'arrêt des centrales nucléaires ».</td>
        <td><strong>Contradiction directe</strong>. Les registres certifient que l'inertie du système était de H = 2,3 s au moment de l'effondrement, soit au-dessus du seuil recommandé par l'ENTSO-E. L'événement n'était pas un effondrement dû à un déficit de masse synchrone, mais un phénomène d'instabilité capacitive.</td>
      </tr>
      <tr>
        <td><strong>El Mundo</strong></td>
        <td>« Flamanville 3 et les 56 réacteurs nucléaires français qui ont sauvé l'antinucléaire Sánchez lors de la grande panne », attribuant implicitement le rétablissement à la technologie nucléaire.</td>
        <td><strong>Imprécision</strong>. Le rôle de la France a été pertinent (4 500 MW de soutien), mais la récupération s'est également articulée grâce au démarrage autonome de centrales hydroélectriques et au soutien du Maroc, le nucléaire n'étant qu'un facteur parmi d'autres.</td>
      </tr>
      <tr>
        <td><strong>La Razón</strong></td>
        <td>Un rapport préliminaire concluant que « la programmation d'une production synchrone insuffisante avec contrôle dynamique de la tension a été la cause de la panne ».</td>
        <td><strong>Soutien partiel</strong>. Le déficit d'absorption de réactive dans le Sud était un facteur documenté (IIT-ICAI), mais ce même rapport souligne que ce déficit s'est produit dans le contexte des manœuvres de maillage de l'Opérateur du Système, un facteur que la couverture médiatique a omis.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>""",
        "text2": "Certains arguments sont **techniquement cohérents** avec les rapports, tandis que d'autres introduisent des écarts significatifs (voir Tableau 3) :",
        "table2": """<ForensicTable
  title="TABLEAU 3 | FACT-CHECK: MÉDIAS AYANT UNE POSTURE FAVORABLE AU RÉCIT INSTITUTIONNEL"
  source="Élaboration propre (contraste avec les rapports d'expertise de l'ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Média</th>
        <th>Allégation publiée</th>
        <th>Contraste avec le consensus technique (Rapports d'expertise)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>El País</strong></td>
        <td>La capacité d'échange avec la France s'élève à 3 %, bien en deçà de l'objectif européen de 15 %.</td>
        <td><strong>Cohérent</strong>. S'il y avait eu une plus grande capacité d'interconnexion, la probabilité et la virulence des oscillations inter-zones auraient été moindres.</td>
      </tr>
      <tr>
        <td><strong>elDiario.es</strong></td>
        <td>REE a opéré avec des marges de sécurité réduites malgré des prévisions de fort rayonnement solaire et de faible production synchrone.</td>
        <td><strong>Cohérent</strong>. Cohérent avec le diagnostic du déficit de puissance réactive dans le sud, bien que la couverture n'ait pas articulé le mécanisme technique sous-jacent de la saturation des courbes Q-V.</td>
      </tr>
      <tr>
        <td><strong>La Vanguardia</strong></td>
        <td>Ouverture transpyrénéenne décrite comme une action « égoïste » des mécanismes continentaux pour préserver l'approvisionnement en France.</td>
        <td><strong>Écart/Contradiction</strong>. Contredit l'avis de l'ENTSO-E : l'ouverture à 12h33:21 CEST a été l'action automatique des protections contre la perte de synchronisme (OST) face à une divergence angulaire sévère. Attribuer un caractère délibéré à un mécanisme de protection automatique implique une confusion de concepts.</td>
      </tr>
      <tr>
        <td><strong>infoLibre</strong></td>
        <td>Les opérateurs privés ont « délibérément » échoué en n'absorbant pas l'excès de tension.</td>
        <td><strong>Écart</strong>. Intègre l'accusation d'indiscipline technique du gouvernement, mais omet chronologiquement le premier facteur : la manœuvre de maillage qui a injecté de l'énergie réactive capacitive dans le réseau avant que le moindre déclenchement ne se produise.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>"""
    },
    "it": {
        "text1": "Alcuni degli argomenti presentati contengono **incoerenze verificabili** con i rapporti tecnici, come riassunto nella Tabella 2.",
        "table1": """<ForensicTable
  title="TABELLA 2 | FACT-CHECK: MEDIA CRITICI CON LA GESTIONE ISTITUZIONALE"
  source="Elaborazione propria (contrasto con i rapporti periziali ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Media</th>
        <th>Affermazione pubblicata</th>
        <th>Contrasto con il consenso tecnico (Rapporti periziali)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ABC</strong></td>
        <td>La rete si trovava «a un capello» dal collasso per la «allarmante mancanza di inerzia rotazionale provocata dalle centrali nucleari spente».</td>
        <td><strong>Contraddizione diretta</strong>. Le registrazioni certificano che l'inerzia del sistema era H = 2,3 s, superiore alla soglia raccomandata da ENTSO-E. L'evento non è stato un collasso per deficit di massa sincrona, bensì un fenomeno di instabilità capacitiva.</td>
      </tr>
      <tr>
        <td><strong>El Mundo</strong></td>
        <td>«Flamanville 3 e le 56 centrali nucleari francesi che hanno salvato l'antinucleare Sánchez durante il grande blackout», attribuendo implicitamente il ripristino alla tecnologia nucleare.</td>
        <td><strong>Imprecisione</strong>. Il ruolo della Francia è stato rilevante (4.500 MW di supporto), ma il ripristino si è basato anche sull'avviamento autonomo di idroelettriche e sul supporto dal Marocco, con il nucleare come uno dei vari fattori.</td>
      </tr>
      <tr>
        <td><strong>La Razón</strong></td>
        <td>Un rapporto preliminare conclude che «la programmazione di insufficiente generazione sincrona con controllo dinamico della tensione è stata la causa del blackout».</td>
        <td><strong>Supporto parziale</strong>. Il deficit di capacità di assorbimento di reattiva nel Sud è stato un fattore documentato (IIT-ICAI), ma lo stesso rapporto sottolinea che tale deficit si è prodotto nel contesto delle manovre di magliatura dell'Operatore del Sistema, fattore che la copertura ha omesso.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>""",
        "text2": "Alcuni argomenti sono **tecnicamente coerenti** con i rapporti, mentre altri introducono deviazioni significative (vedi Tabella 3):",
        "table2": """<ForensicTable
  title="TABELLA 3 | FACT-CHECK: MEDIA CON POSTURA FAVOREVOLE ALLA NARRATIVA ISTITUZIONALE"
  source="Elaborazione propria (contrasto con i rapporti periziali ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Media</th>
        <th>Affermazione pubblicata</th>
        <th>Contrasto con il consenso tecnico (Rapporti periziali)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>El País</strong></td>
        <td>La capacità di scambio con la Francia si attesta al 3%, molto inferiore all'obiettivo europeo del 15%.</td>
        <td><strong>Coerente</strong>. Se vi fosse stata una maggiore capacità di interconnessione, la probabilità e la virulenza delle oscillazioni inter-area sarebbero state minori.</td>
      </tr>
      <tr>
        <td><strong>elDiario.es</strong></td>
        <td>REE ha operato con margini di sicurezza ridotti nonostante le previsioni di elevata radiazione solare e bassa generazione sincrona.</td>
        <td><strong>Coerente</strong>. Coerente con la diagnosi del deficit di potenza reattiva nel Sud, sebbene la copertura non abbia articolato il meccanismo tecnico sottostante della saturazione delle curve Q-V.</td>
      </tr>
      <tr>
        <td><strong>La Vanguardia</strong></td>
        <td>L'apertura transfrontaliera è descritta como un'azione «egoistica» dei meccanismi continentali per salvaguardare la Francia.</td>
        <td><strong>Deviazione/Contraddizione</strong>. Contrasta con il parere di ENTSO-E: l'apertura alle 12:33:21 CEST è stata automatica (protezioni OST) a fronte di una severa divergenza angolare. Attribuire intenzionalità a un meccanismo di protezione automatica comporta confusione concettuale.</td>
      </tr>
      <tr>
        <td><strong>infoLibre</strong></td>
        <td>Gli operatori privati hanno fallito «deliberatamente» nel non assorbire la tensione in eccesso.</td>
        <td><strong>Deviazione</strong>. Incorpora l'accusa governativa di indisciplina tecnica, ma omette cronologicamente il primo fattore: la manovra di magliatura che ha iniettato reattiva capacitiva nella rete prima di qualsiasi scatto.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>"""
    },
    "pt": {
        "text1": "Alguns dos argumentos apresentados contêm **inconsistências verificáveis** com os relatórios técnicos, conforme resumido na Tabela 2.",
        "table1": """<ForensicTable
  title="TABELA 2 | FACT-CHECK: MEIOS CRÍTICOS DA GESTÃO INSTITUCIONAL"
  source="Elaboração própria (contraste com relatórios periciais ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Meio</th>
        <th>Afirmação publicada</th>
        <th>Contraste com o consenso técnico (Relatórios periciais)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ABC</strong></td>
        <td>A rede encontrava-se «a um fio de cabelo» de colapsar pela «alarmante falta de inércia rotacional provocada pelas centrais nucleares desligadas».</td>
        <td><strong>Contradição direta</strong>. Os registos certificam que a inércia do sistema era H = 2,3 s no momento do colapso, acima do limiar recomendado pela ENTSO-E. O evento não foi um colapso por défice de massa síncrona, mas sim um fenómeno de instabilidade capacitiva.</td>
      </tr>
      <tr>
        <td><strong>El Mundo</strong></td>
        <td>«Flamanville 3 e as 56 nucleares francesas que salvaram o antinuclear Sánchez durante o grande apagão», atribuindo implicitamente a reposição à tecnologia nuclear.</td>
        <td><strong>Imprecisão</strong>. O papel da França foi relevante (4.500 MW de suporte), mas a recuperação articulou-se também através de arranque autónomo de hidroelétricas e suporte de Marrocos, sendo a nuclear um de vários fatores.</td>
      </tr>
      <tr>
        <td><strong>La Razón</strong></td>
        <td>Relatório preliminar conclui que «a programação de insuficiente geração síncrona com controlo dinâmico de tensão foi a causa do apagão».</td>
        <td><strong>Apoio parcial</strong>. O défice de capacidade de absorção de reativa no Sul foi um fator documentado (IIT-ICAI), mas o mesmo relatório sublinha que esse défice se produziu no contexto das manobras de malha do Operador do Sistema, fator omitido pela cobertura.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>""",
        "text2": "Alguns argumentos são **tecnicamente consistentes** com os relatórios, enquanto outros introduzem desvios significativos (ver Tabela 3):",
        "table2": """<ForensicTable
  title="TABELA 3 | FACT-CHECK: MEIOS COM POSTURA FAVORÁVEL À NARRATIVA INSTITUCIONAL"
  source="Elaboração própria (contraste com relatórios periciais ENTSO-E / IIT-ICAI / REE)"
>
  <table>
    <thead>
      <tr>
        <th>Meio</th>
        <th>Afirmação publicada</th>
        <th>Contraste com o consenso técnico (Relatórios periciais)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>El País</strong></td>
        <td>A capacidade de intercâmbio com a França situa-se em 3 %, muito inferior ao objetivo europeu de 15 %.</td>
        <td><strong>Consistente</strong>. Se existisse maior capacidade de interconexão, a probabilidade e virulência das oscilações inter-áreas teriam sido menores.</td>
      </tr>
      <tr>
        <td><strong>elDiario.es</strong></td>
        <td>A REE operou com margens de segurança reduzidas apesar da previsão de alta radiação solar e baixa geração síncrona.</td>
        <td><strong>Consistente</strong>. Coerente com o diagnóstico do défice de potência reativa no Sul, embora a cobertura não tenha articulada o mecanismo técnico subjacente da saturação das curvas Q-V.</td>
      </tr>
      <tr>
        <td><strong>La Vanguardia</strong></td>
        <td>Abertura transpirenaica descrita como atuação «egoísta» de mecanismos continentais para salvaguardar a França.</td>
        <td><strong>Desvio/Contradição</strong>. Contraria o parecer da ENTSO-E: a abertura às 12:33:21 CEST foi automática (proteções OST) face a uma severa divergência angular. Atribuir intencionalidade a um mecanismo de proteção automática envolve confusão conceptual.</td>
      </tr>
      <tr>
        <td><strong>infoLibre</strong></td>
        <td>Operadores privados falharam «deliberadamente» ao não absorver a tensão excedente.</td>
        <td><strong>Desvio</strong>. Incorpora a acusação governamental de indisciplina técnica, mas omite cronologicamente o primeiro fator: a manobra de malha que injetou reativa capacitiva na rede antes de qualquer disparo.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>"""
    }
}

for lang in LANGS:
    filepath = os.path.join(I18N_DIR, lang, "docusaurus-plugin-content-docs", "current", "06-impacto-comunicativo.mdx")
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    modified = content
    lang_data = tables_by_lang[lang]
    
    # Let's match the bullet lists with a flexible regex that supports leading O, O , etc.
    # We want to match: - (any word space)? **ABC** up to \n\n![
    bullet_pattern1 = re.compile(r'- (?:\w+\s+)?\*\*ABC\*\*[\s\S]+?(?=\n!\[)')
    match1 = bullet_pattern1.search(modified)
    if match1:
        modified = modified.replace(match1.group(0), lang_data["table1"] + "\n\n")
        print(f"  [{lang}] Replaced Critical Media bullet list with Table 2.")
    else:
        print(f"  [{lang}] Warning: Critical Media bullets not found!")
        
    bullet_pattern2 = re.compile(r'- (?:\w+\s+)?\*\*(?:El País|El Pais)\*\*[\s\S]+?(?=\n!\[)')
    match2 = bullet_pattern2.search(modified)
    if match2:
        modified = modified.replace(match2.group(0), lang_data["table2"] + "\n\n")
        print(f"  [{lang}] Replaced Favourable Media bullet list with Table 3.")
    else:
        print(f"  [{lang}] Warning: Favourable Media bullets not found!")
        
    # We will split and update paragraphs based on their index and keywords
    lines = modified.split('\n')
    
    # For paragraph 1: check for 'inconsist' or 'inkonsist' or 'incoher' or 'incoeren' or 'inconsistências' case-insensitively
    p1_keywords = ["inconsist", "inkonsist", "incoher", "incoeren", "incohér"]
    for i, line in enumerate(lines):
        if any(kw in line.lower() for kw in p1_keywords):
            if ":" in line or "." in line:
                lines[i] = lang_data["text1"]
                print(f"  [{lang}] Updated Paragraph 1.")
                break
                
    # For paragraph 2: check for 'consistent', 'cohérent', 'coerent', 'konsistent' case-insensitively, avoiding paragraph 1
    p2_keywords = ["consistent", "cohérent", "coerent", "konsistent", "consistente"]
    for i, line in enumerate(lines):
        if any(kw in line.lower() for kw in p2_keywords) and not any(kw in line.lower() for kw in p1_keywords):
            if ":" in line or "." in line or "Tabla" in line or "Tabelle" in line or "Table" in line or "Tableau" in line or "Tabella" in line:
                lines[i] = lang_data["text2"]
                print(f"  [{lang}] Updated Paragraph 2.")
                break
                
    # Also, we MUST check if the file imports ForensicTable. If not, let's inject the import at the top of the file!
    modified = '\n'.join(lines)
    if "import { ForensicTable }" not in modified:
        # Inject the import right after frontmatter
        parts = modified.split('---', 2)
        if len(parts) == 3:
            modified = parts[0] + '---' + parts[1] + '---\nimport { ForensicTable } from "@site/src/components/ForensicUI/Primitives";\n' + parts[2]
            print(f"  [{lang}] Injected ForensicTable import at the top.")
            
    # Save the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(modified)
    print(f"  [{lang}] Successfully saved restored communicative tables.")
