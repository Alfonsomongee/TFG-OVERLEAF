// Auto-generated — German glossary
// Generated: 2026-06-12T18:59:27.718Z

export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    "id": "aelec",
    "letter": "A",
    "term": "AELEC",
    "definition": "Spanischer Elektrizitätswirtschaftsverband, der die wichtigsten Betreiber, Händler und Übertragungsnetzbetreiber des spanischen Stromsektors vereint. Seine Hauptaufgabe ist die Branchenvertretung gegenüber nationalen und europäischen Verwaltungen und Regulierungsbehörden. Im Kontext des 28-A hat AELEC zusammen mit der Universität Pontificia Comillas die technische Studie des IIT-ICAI mitfinanziert, die zur rigorosesten analytischen Referenz über den Vorfall wurde und sich damit im – für einen Branchenverband ungewöhnlichen – Raum der unabhängigen technischen Untersuchung des Zusammenbruchs, der seine eigenen Mitgliedsunternehmen betraf, positionierte."
  },
  {
    "id": "afrr-automatic-frequency-restoration-reserve",
    "letter": "A",
    "term": "aFRR (Automatic Frequency Restoration Reserve)",
    "definition": "Die automatische Frequenzwiederherstellungsreserve (aFRR), historisch als Sekundärregelung bezeichnet, ist der Regelungsdienst, der automatisch durch das automatische Erzeugungsregelungssystem (AGC) des Systembetreibers aktiviert wird, um die Frequenz auf ihren Nennwert (50 Hz) zurückzuführen und die Austauschflüsse an den Grenzkuppelstellen auf die vereinbarten Fahrpläne wiederherzustellen, mit einem zeitlichen Horizont von 30 Sekunden bis 15 Minuten. Im Gegensatz zur Primärregelung (FCR), die in den ersten Sekunden durch die sofortige Reaktion der Drehzahlregler der Synchrongeneratoren wirkt, arbeitet die aFRR über das Integral des Frequenzfehlers, um die bleibende Abweichung zu beseitigen. Der 28-A hat mit der Klarheit, die nur Katastrophen bieten, gezeigt, dass der iberische Zusammenbruch grundlegend ein Phänomen der Spannungsinstabilität (Q-V) war, nicht der Wirkfrequenz: Das AGC hatte technisch die Fähigkeit, auf den Wirkleistungsbilanzausgleich einzuwirken, aber der dominierende Mechanismus – die Kaskade von reaktiven Überspannungen – operierte in einer Zeitskala (30 Sekunden) und in einer physikalischen Dimension (Blindleistung, nicht Wirkleistung), auf die die aFRR keinerlei Einfluss hat."
  },
  {
    "id": "area-de-control",
    "letter": "R",
    "term": "Regelzone",
    "definition": "Geografisches und elektrisches Gebiet unter der Verantwortung eines Übertragungsnetzbetreibers (TSO), begrenzt durch Grenzkuppelstellen, deren Leistungsaustausch mit benachbarten Gebieten in Echtzeit über das AGC-System geplant und überwacht wird. Die Iberische Halbinsel bildete eine einheitliche Regelzone – gemeinsam betrieben von REE in Spanien und REN in Portugal – die über die schmale Grenze der Pyrenäen mit dem kontinentaleuropäischen Verbundnetz verbunden war. Diese Konfiguration einer „Quasi-Synchroninsel“ bedeutet, dass der Synchronverlust mit Frankreich nicht einfach ein Verbindungsfehler war, sondern die spektrale Signatur dafür, dass das iberische System nicht mehr in der Lage war, sein eigenes Gleichgewicht innerhalb des kontinentalen Synchronverbunds aufrechtzuerhalten: Am 28-A manifestierte sich diese Signatur um 12:33:21 Uhr MESZ mit der Auslösung der ANSI-78-Relais der Pyrenäenverbindungen."
  },
  {
    "id": "arranque-autonomo-black-start",
    "letter": "S",
    "term": "Schwarzstartfähigkeit (Black Start)",
    "definition": "Regelungsdienst, bei dem bestimmte Erzeugungsanlagen – typischerweise Speicherwasserkraftwerke oder für den Eigenstart ausgerüstete Gas- und Dampfturbinenkraftwerke – ihre eigenen Hilfsbetriebe versorgen und Spannung in ein spannungsloses Netz einspeisen können, ohne vorherige externe elektrische Versorgung. Es ist die Fähigkeit, ohne die eine Wiederherstellung nach einem vollständigen Blackout technisch unmöglich ist: Jemand muss „das erste Licht anzünden“. Am 28-A hing die Wiederherstellung des iberischen Systems kritisch von der geografischen Verfügbarkeit und der schnellen Aktivierungsfähigkeit dieser Einheiten ab; der Fortschritt der Wiedereinschaltung von den Schwarzstartknoten zu den entferntesten Lasten dauerte je nach Zone zwischen 7 und 18,5 Stunden, was sowohl die Robustheit des bestehenden Wiederherstellungsplans als auch seine logistischen Engpässe bei einem Zusammenbruch dieser geografischen Ausdehnung zeigt."
  },
  {
    "id": "bess-battery-energy-storage-system",
    "letter": "B",
    "term": "BESS (Battery Energy Storage System)",
    "definition": "Batterie-Energiespeichersystem: Integrierte Einheit bestehend aus elektrochemischen Zellen (typischerweise Lithium-Ionen- oder LFP-Chemie), einem Batteriemanagementsystem (BMS) und einem oder mehreren bidirektionalen Leistungsumrichtern, die es ermöglicht, elektrische Energie in chemischer Form zu speichern und mit Reaktionszeiten im Millisekundenbereich ins Netz zurückzuspeisen. Seine funktionale Vielseitigkeit – es kann als Generator oder als Last wirken und in Bruchteilen eines Zyklus zwischen den Modi wechseln – macht es zur flexibelsten Ressource im modernen System. Der 28-A zeigte, dass die Reaktionsgeschwindigkeit eines BESS eine notwendige, aber nicht hinreichende Bedingung für Stabilität ist: Die Steuerungsart des zugehörigen Umrichters (GFL vs. GFM) bestimmt, ob diese Schnelligkeit zur Verankerung des Netzes oder zur Beschleunigung seines Zusammenbruchs beiträgt."
  },
  {
    "id": "bess-con-inversores-grid-forming-bess-gfm",
    "letter": "B",
    "term": "BESS mit Grid-Forming-Umrichtern (BESS-GFM)",
    "definition": "Batteriespeichersysteme, deren Umrichter im Grid-Forming-Modus arbeiten und als ideale Spannungsquelle fungieren, die autonom Amplitude und Frequenz des lokalen Netzes einstellen kann, ohne eine externe Referenz zu benötigen. Die Kombination aus hoher elektrochemischer Energiedichte und der Fähigkeit zur Netzstützung macht BESS-GFM zur vielseitigsten Ressource für die Bereitstellung wesentlicher Zuverlässigkeitsdienste (ERS): konfigurierbare synthetische Trägheit, dynamische Spannungsstützung und virtuelle Kurzschlussleistung. Der 28-A zeigte, dass der auf der Halbinsel installierte Speicherpark – dominiert von GFL-Umrichtern – diese Fähigkeit nicht besaß; das Königliche Dekret 997/2025 setzt folglich ein Ziel von 22,5 GW GFM-Speicher bis 2030, was BESS-GFM zum Rückgrat der neuen Architektur der spanischen Systemdienstleistungen macht."
  },
  {
    "id": "bucle-de-retroalimentacion-feedback-loop",
    "letter": "R",
    "term": "Rückkopplungsschleife (Feedback Loop)",
    "definition": "Eine positive Rückkopplungsschleife ist ein Mechanismus, bei dem die Reaktion des Systems auf eine anfängliche Störung die ursprüngliche Abweichung verstärkt anstatt zu dämpfen: Die Störung verstärkt sich selbst in einem Kreislauf, der, wenn er nicht durch einen externen stabilisierenden Mechanismus unterbrochen wird, zum Zusammenbruch führt. Es ist das dynamische Gegenteil der negativen Rückkopplung, die stabile selbstregulierende Systeme kennzeichnet. Der 28-A lieferte ein Paradebeispiel für diese Dynamik: Jede IBR-Anlage, die aufgrund von Überspannung auslöste, reduzierte die induktive Blindleistungsaufnahme, die die kapazitive Erzeugung der unbelasteten Leitungen kompensierte; mit der Verringerung der Aufnahme stieg die Spannung; mit dem Anstieg der Spannung erreichten weitere Anlagen ihre ANSI-59-Schwellen und lösten aus. In weniger als 30 Sekunden wurde eine Schleife, die in einem System mit ausreichender elektrischer Steifigkeit gedämpft worden wäre, zu einem Wettlauf in Richtung Nullspannung."
  },
  {
    "id": "cambiadores-de-tomas-en-carga-oltc",
    "letter": "S",
    "term": "Stufenschalter unter Last (OLTC)",
    "definition": "Elektromechanischer Mechanismus, der in großen Leistungstransformatoren installiert ist und das Übersetzungsverhältnis – und damit die Sekundärspannung – ohne Unterbrechung der Versorgungskontinuität durch schrittweises Verschieben einer Anzapfung an der Wicklung ändert. Er regelt langsame Spannungsänderungen in einem typischen Bereich von ±10 % mit diskreten Stufen von 1–2 %. Seine strukturelle Einschränkung liegt in der mechanischen Trägheit des Antriebs: Die Reaktionszeit pro Stufe, bedingt durch Motor und Getriebe, liegt in der Größenordnung von mehreren Sekunden, was ihn blind für Transienten im Zehntelsekundenbereich macht, die schnelle Spannungskollapse kennzeichnen. Diese Blindheit war genau der Mechanismus des Tap-Lag, der den 28-A verstärkte: Die OLTCs hatten die Stufen schrittweise erhöht, um vorherige Spannungseinbrüche zu kompensieren; als die Überspannung durch die Vermaschung und die unbelasteten Leitungen eintrat, verhinderte ihre mechanische Trägheit ein rechtzeitiges Herunterregeln, was die Spannung in den 220-kV-Sammelschienen mit Konsequenzen verstärkte, die das SCADA von REE auf der 400-kV-Ebene nicht beobachten konnte."
  },
  {
    "id": "ccgt-combined-cycle-gas-turbine",
    "letter": "C",
    "term": "CCGT (Combined Cycle Gas Turbine)",
    "definition": "Gas- und Dampfturbinenkraftwerk: Thermische Erzeugungstechnologie, die eine Gasturbine (Brayton-Kreisprozess) mit einer Dampfturbine kombiniert, die durch die Abgase über einen Abhitzekessel (Rankine-Kreisprozess) gespeist wird, und Wirkungsgrade von 55–60 % erreicht. Ihre großen Synchrongeneratoren lieferten historisch den größten Anteil an Trägheit und Kurzschlussleistung im iberischen System. Die zunehmende Durchdringung erneuerbarer Energien hat CCGTs in den marginalen Reservebetrieb verdrängt, wodurch ihre Betriebsstunden und damit die im synchronen Park verfügbare kinetische Energie reduziert wurden; der 28-A, bei dem die GuD-Kraftwerke mit minimaler Last liefen und die Erzeugung von IBR-Umrichtern ohne elektromechanische Kopplung dominiert wurde, veranschaulicht den systemischen Preis dieser Verdrängung, wenn sie nicht von einem expliziten Ersatz der Trägheitsdienste begleitet wird, die CCGTs als kostenloses Nebenprodukt ihres Betriebs bereitstellten."
  },
  {
    "id": "cecre-centro-de-control-de-energias-renovables",
    "letter": "C",
    "term": "CECRE (Zentrum für die Steuerung erneuerbarer Energien)",
    "definition": "Betriebszentrum von Red Eléctrica de España, verantwortlich für die Echtzeitüberwachung und -steuerung von erneuerbaren Energieparks und Speichersystemen, die an das iberische Netz angeschlossen sind, sowie für die Ausführung der Algorithmen des VOLTAIRE-Systems zur dynamischen Spannungsregelung durch Blindleistungssollwerte. Das CECRE stellte am 28-A einen der wenigen Mechanismen der zentralisierten Reaktion dar, der technisch in der Lage war, die Blindleistungsaufnahme der Photovoltaikparks in Echtzeit anzupassen; die Frage, die die spätere Untersuchung präzise beantworten muss, ist, ob der Handlungsspielraum, über den es verfügte, physikalisch ausreichend war, um der Geschwindigkeit der Instabilität zu begegnen, oder ob die hierarchische Architektur von VOLTAIRE – ausgelegt für langsame Störungen – strukturell nicht in der Lage war, einer Kaskade zu folgen, die sich in 30 Sekunden vollendete."
  },
  {
    "id": "centros-de-coordinacion-regional-rcc",
    "letter": "R",
    "term": "Regionale Koordinierungszentren (RCC)",
    "definition": "Supranationale Einrichtungen, die durch die EU-Stromverordnung (2019/943) eingerichtet wurden, um die operative Zusammenarbeit zwischen den Übertragungsnetzbetreibern (TSO) innerhalb jeder europäischen Synchronregion zu erleichtern, mit Funktionen der koordinierten Sicherheitsanalyse, regionalen Angemessenheitsbewertung und Koordinierung grenzüberschreitender Flüsse. Der 28-A legte die operative Reibung zwischen dem RCC der kontinentaleuropäischen Region und den Echtzeit-Betriebsentscheidungen von REE und REN offen: Die Trennung der Iberischen Halbinsel vom kontinentalen System, die sich in der Auslösung der Pyrenäenverbindungen um 12:33:21 Uhr MESZ manifestierte, erforderte ein Maß an grenzüberschreitender Koordination, das nach späteren Analysen an der Grenze der für Szenarien dieser Größenordnung vorgesehenen Kommunikationsprotokolle und Reaktionszeiten operierte."
  },
  {
    "id": "colapso-q-v",
    "letter": "Q",
    "term": "Q-V-Zusammenbruch",
    "definition": "Instabilitätsphänomen, bei dem die Unfähigkeit des Systems, den Blindleistungsbedarf zu decken, einen autokatalytischen Spannungsabfall – oder in seiner symmetrischen Variante einen Spannungsanstieg – bis zum Zusammenbruch verursacht, was in der Q-V-Ebene dem Überschreiten des Betriebspunkts über den Nasenpunkt der Blindleistungskennlinie entspricht, wo kein stabiler Gleichgewichtspunkt mehr möglich ist. Der 28-A kehrte die klassische Kausalität des Q-V-Zusammenbruchs um: Der dominierende Mechanismus war nicht ein Blindleistungsdefizit (niedrige Spannungen), sondern ein Überschuss an kapazitiver Blindleistung, die von den unbelasteten Leitungen nach der Vermaschung erzeugt wurde, was die Spannung so weit anhob, dass die IBR-Umrichter kaskadenartig auslösten. Ein Zusammenbruch durch Überspannung ist in gewissem Sinne dasselbe Phänomen, vom anderen Ende der Kennlinie betrachtet: Das Netz überschritt die Stabilitätsgrenze nicht durch Absenkung, sondern durch Spannungsanstieg über den mit den verfügbaren Blindleistungsaufnahmeressourcen beherrschbaren Bereich hinaus."
  },
  {
    "id": "compensadores-sincronos-syncons",
    "letter": "S",
    "term": "Synchrongeneratoren (SynCons)",
    "definition": "Synchron rotierende Maschinen, die im Leerlauf betrieben werden – ohne Kopplung an eine Primärturbine – deren einzige Funktion der dynamische Blindleistungsaustausch mit dem Netz durch Erregerregelung ist, wobei sie gleichzeitig echte rotatorische Trägheit und die Fähigkeit zur Einspeisung von Fehlerströmen von 300–400 % ihres Nennwerts ohne Steuerungsalgorithmus bereitstellen: Die Reaktion ist eine direkte Folge der physikalischen elektromagnetischen Kopplung der Maschine mit dem Netz. Das Fehlen ausreichender Synchrongeneratoren im Süden der Halbinsel – einer Zone, die am 28-A mit einem SCR < 2 betrieben wurde – ist einer der strukturellen Faktoren, die der IIT-Comillas-Bericht als Vorbedingung des Zusammenbruchs identifiziert: Ihre Anwesenheit hätte die elektrische Steifigkeit bereitgestellt, die GFL-Umrichter konstruktionsbedingt nicht liefern können."
  },
  {
    "id": "compensador-sincrono-estatico-statcom",
    "letter": "S",
    "term": "Statischer Synchronkompensator (STATCOM)",
    "definition": "Aktives Blindleistungskompensationsgerät auf Basis von VSC-Umrichtern (Voltage Source Converter), das kontinuierlich, dynamisch und quasi sofort Blindleistung einspeist oder aufnimmt, im Gegensatz zur diskreten und langsamen Reaktion mechanisch schaltbarer Kondensatorbänke. Im Gegensatz zum rotierenden Synchronkompensator hat der STATCOM keine rotierende Masse und liefert weder Trägheit noch robusten Fehlerstrom: Seine Fähigkeit zur Stromeinspeisung bei Fehlern ist auf das 1,1- bis 1,2-fache des Nennwerts begrenzt, verglichen mit 300–400 % bei einem SynCon. Er ist die optimale Wahl für Spannungsstützung im quasistationären Betrieb; der 28-A zeigte jedoch, dass bei schnellen Transienten – dem Zeitfenster von 30 ms bis 1 s, das einer IBR-Auslösekaskade vorausgeht und sie begleitet – das Fehlen eines physikalischen Fehlerstroms den STATCOM zu einem unzureichenden Instrument macht, wenn das Netz bereits am Rande des Zusammenbruchs steht und nicht nur Blindleistung, sondern echte elektrische Steifigkeit benötigt."
  },
  {
    "id": "control-grid-forming-frente-a-grid-following",
    "letter": "G",
    "term": "Grid-Forming- vs. Grid-Following-Regelung",
    "definition": "Regelungsparadigma, das die kausale Beziehung zwischen dem Umrichter und dem Netz, an das er angeschlossen ist, definiert. Ein Grid-Following-Umrichter (GFL) modelliert seinen Ausgang als gesteuerte Stromquelle, die sich passiv mit der vom Netz vorgegebenen Spannung und Frequenz über einen Phase-Locked Loop (PLL) synchronisiert; er ist strukturell von einer stabilen externen Referenz abhängig und kann in schwachen Netzen nicht betrieben werden. Ein Grid-Forming-Umrichter (GFM) modelliert seinen Ausgang dagegen als ideale Spannungsquelle hinter einer virtuellen Impedanz: Er stellt aktiv seine eigene Spannungs- und Frequenzwelle ein und kann das Netz autonom stützen. Der Unterschied ist nicht nur technisch, sondern auch kausal: Der 28-A war in seinem tiefsten Mechanismus die Folge des Aufbaus eines von GFL-Umrichtern dominierten Systems, die das Netz im Moment der größten dynamischen Belastung nicht verankerten, sondern es genau dann verließen, als es sie am meisten brauchte."
  },
  {
    "id": "coste-nivelado-de-la-energia-lcoe",
    "letter": "S",
    "term": "Stromgestehungskosten (LCOE)",
    "definition": "Standardisierte wirtschaftliche Kennzahl, die die Stückkosten der Erzeugung zwischen Technologien über deren Lebensdauer vergleicht – ausgedrückt in €/MWh unter Einbeziehung von CAPEX, OPEX und Kapazitätsfaktor – und Vergleiche zwischen Technologien mit sehr unterschiedlichen Investitions- und Erzeugungsprofilen ermöglicht. Ihre systemisch relevanteste Einschränkung, die der 28-A mit besonderer Deutlichkeit offenlegte, besteht darin, dass sie den Wert der Systemdienstleistungen, die eine Technologie beisteuert oder deren Fehlen extern beschafft werden muss, völlig ignoriert. Eine Solaranlage mit LCOE von 25 €/MWh, die die Installation von Synchronkompensatoren zu zusätzlichen Systemkosten von 15 €/MWh erfordert, hat tatsächliche Netzkosten, die über dem isolierten LCOE liegen; die fehlende Internalisierung dieser Externalität im Marktpreis ist die regulatorische Reibung, die das RD 997/2025 durch explizite Märkte für Essential Reliability Services (ERS) zu korrigieren versucht."
  },
  {
    "id": "crisis-communication-failure",
    "letter": "C",
    "term": "Crisis Communication Failure",
    "definition": "Im Krisenmanagement beschreibt der Crisis Communication Failure das institutionelle Versagen, nach einem schwerwiegenden Vorfall während des kritischen Zeitfensters, in dem das Publikum am empfänglichsten und am anfälligsten für alternative Narrative ist, nicht rechtzeitig den Informationsraum mit überprüfbaren Botschaften zu besetzen. Das Chaos Communication Model besagt, dass, wenn die verantwortliche Institution in den ersten 1–6 Stunden keine kohärente Darstellung liefert, das diskursive Vakuum unweigerlich von nicht autorisierten Quellen gefüllt wird. Am 28-A verging die erste Stunde nach Beginn des Zusammenbruchs (12:33 MESZ) ohne klare institutionelle Kommunikation weder von REE noch vom Ministerium für den ökologischen Wandel; der Informationsraum wurde in diesem Intervall von Theorien besetzt, die den Blackout einem Cyberangriff oder Sabotage zuschrieben – Narrative, die, einmal im Medienökosystem verankert, außerordentlich schwer zu vertreiben sind, selbst wenn die spätere technische Erklärung einwandfrei ist."
  },
  {
    "id": "criterio-n-1",
    "letter": "N",
    "term": "N-1-Kriterium",
    "definition": "Grundlegende Sicherheitsnorm für den Betrieb und die Planung von Elektrizitätssystemen, die die Verpflichtung festlegt, Spannung und Frequenz nach dem kontingenten Ausfall eines beliebigen einzelnen Elements – Generator, Leitung oder Transformator – innerhalb der normativen Grenzen zu halten, ohne kaskadierende Versorgungsunterbrechungen oder Geräteschäden zu verursachen; geregelt durch den SO GL der ENTSO-E und die spanische P.O. 1.1. Der 28-A eröffnet eine regulatorische Debatte ersten Ranges: Das System operierte formal im N-1-konformen Zustand in Bezug auf topologische Kontingenzen und brach dennoch zusammen. Der Mechanismus waren akkumulierte dynamische Schwachstellen – niedrige Trägheit, hohe GFL-Konzentration, degradierter SCR – die das klassische N-1-Kriterium, das für den Verlust diskreter physischer Elemente konzipiert wurde, nicht zu erfassen vermag. Die offene Frage ist, ob der regulatorische Rahmen ein „dynamisches N-1-Kriterium“ benötigt, das den gleichzeitigen Verlust eines Prozentsatzes des IBR-Parks als Planungskontingenz bewertet."
  },
  {
    "id": "csn-consejo-de-seguridad-nacional",
    "letter": "C",
    "term": "CSN (Nationaler Sicherheitsrat)",
    "definition": "Kollegialorgan unter Vorsitz des spanischen Ministerpräsidenten, das die nationale Sicherheitspolitik koordiniert, einschließlich des Schutzes kritischer Infrastrukturen wie des Stromsystems. Mitverfasser des offiziellen Regierungsberichts über den Blackout vom 28-A, der zusammen mit Red Eléctrica de España veröffentlicht wurde und die erste institutionelle Version der Ereignisse darstellte; ergänzt durch die unabhängige technische Analyse des IIT-Comillas, finanziert von AELEC, die die technische Tiefe lieferte, die der Regierungsbericht in der verfügbaren Zeit nicht bieten konnte."
  },
  {
    "id": "curva-de-capacidad-reactiva-capability-curve",
    "letter": "B",
    "term": "Blindleistungsfähigkeitskurve (Capability Curve)",
    "definition": "Diagramm in der Wirk-Blindleistungsebene (P-Q), das den Betriebsbereich eines Generators abgrenzt, definiert durch drei physikalische Grenzen: die Erwärmungsgrenze der Statorwicklung (Bogen der maximalen Scheinleistung), die Erwärmungsgrenze der Rotorwicklung (Erregerstabilitätskurve) und die Stabilitätsgrenze im Untererregungsbetrieb. Der Abstand zwischen dem tatsächlichen Betriebspunkt und den Kurvengrenzen bestimmt die verfügbare Blindleistungsregelreserve. Am 28-A arbeiteten die Generatoren im Süden der Halbinsel nahe ihrer Grenze der induktiven Blindleistungsaufnahme im Untererregungsbetrieb; als die Überspannung diese Reserve überstieg, verlor das Netz die letzten automatischen Mechanismen zur Aufnahme kapazitiver Blindleistung, die die Synchrongeneratoren bereitstellen konnten."
  },
  {
    "id": "curva-de-pato-duck-curve",
    "letter": "E",
    "term": "Entenkurve (Duck Curve)",
    "definition": "Tägliches Profil der Netto-Regellast – Gesamtlast abzüglich nicht steuerbarer erneuerbarer Erzeugung – in Systemen mit hohem Solaranteil, das im Stundenverlauf eine charakteristische Form zeichnet: eine tiefe Mulde während der Mittagsstunden (wenn die Einstrahlung maximal ist, der Grundlastverbrauch aber noch nicht den abendlichen Spitzenwert erreicht hat), gefolgt von einem steilen Anstieg am Abend. Der Frühling ist die Zeit der größten Tiefe und größten Verwundbarkeit: Die Solarerzeugung erreicht ihre saisonalen Höchstwerte, während die Last noch nicht das Winterniveau erreicht hat. Der 28-A ereignete sich an einem Montag im April zur Mittagszeit, genau im Moment der größten Tiefe des Tals: Der Solar-Einspeiserampe der vorangegangenen Stunden hatte das System mit minimaler synchroner Last, minimaler Blindleistungsaufnahmefähigkeit und maximaler IBR-Konzentration hinterlassen – genau die Bedingungen, die die Entenkurve als den Moment der größten systemischen Fragilität vorhersagt."
  },
  {
    "id": "curvas-de-estabilidad-de-tension-q-v",
    "letter": "Q",
    "term": "Q-V-Spannungsstabilitätskurven",
    "definition": "Analytisches Werkzeug, das für einen gegebenen Netzknoten die Beziehung zwischen der eingespeisten oder aufgenommenen Blindleistung und der resultierenden Spannung an diesem Knoten darstellt. Die Kurve hat die Form einer umgekehrten Parabel mit einem Minimum (Nose Point), das die Spannungsstabilitätsgrenze definiert: Rechts des Minimums kann das System ein stabiles Gleichgewicht erreichen; links existiert kein möglicher Gleichgewichtspunkt. Der Abstand auf der Q-Achse zwischen dem Betriebspunkt und dem Nose Point definiert die verfügbare Blindleistungsstabilitätsreserve. Die Analysen des IIT-Comillas-Berichts deuten darauf hin, dass die Knoten im Süden der Halbinsel am 28-A mit reduzierten Q-V-Reserven arbeiteten, sodass die plötzliche Einspeisung kapazitiver Blindleistung durch die Vermaschung und die leerlaufenden Leitungen ausreichte, um die Grenze zu überschreiten und in die Zone des irreversiblen Zusammenbruchs einzutreten."
  },
  {
    "id": "damping-ratio-ratio-de-amortiguamiento",
    "letter": "D",
    "term": "Dämpfungsgrad (Damping Ratio)",
    "definition": "Dimensionsloser Indikator, der die Geschwindigkeit der Dämpfung einer elektromechanischen Schwingung nach einer Störung quantifiziert, ausgedrückt als Bruchteil der kritischen Dämpfung. Ein Wert von 5 % gilt als minimale vernünftige Betriebsschwelle im europäischen Synchronverbund; Werte nahe 0 % deuten auf anhaltende Schwingungen hin, die Minuten lang ungedämpft bestehen bleiben können; negative Werte bedeuten zunehmende dynamische Instabilität. Am 28-A detektierten PMU-Aufzeichnungen eine Zwischengebietsschwingung bei 0,6 Hz mit reduzierter Dämpfung in den Minuten vor dem Zusammenbruch – ein Signal, das im Rückblick ein früher Indikator für dynamischen Stress war; die Geschwindigkeit des späteren Zusammenbruchs – 30 Sekunden – übertraf jedoch bei weitem die Reaktionsfähigkeit jedes auf der Überwachung des Dämpfungsgrads basierenden Frühwarnprotokolls."
  },
  {
    "id": "efecto-ferranti",
    "letter": "F",
    "term": "Ferranti-Effekt",
    "definition": "Passives Überspannungsphänomen, das in leerlaufenden oder sehr schwach belasteten Hochspannungsleitungen auftritt: Die verteilte kapazitive Admittanz der Leitung erzeugt selbst ohne angeschlossene Last am Empfangsende einen kapazitiven Strom, und in Abwesenheit ausreichender induktiver Verbraucher, die diesen kompensieren, übersteigt die Spannung am Empfangsende die des Senders, mit einer Größe proportional zur Leitungslänge und zur Frequenz. Besonders ausgeprägt ist dies bei 400-kV-Leitungen, die während Umschaltmanövern unter Spannung gesetzt werden. Am 28-A setzte das zur Anhebung abgesunkener Spannungen im Süden durchgeführte Vermaschungsmanöver Leitungsabschnitte im Leerlauf unter Spannung, deren kapazitive Last eine zusätzliche Blindleistungseinspeisung in ein Netz einbrachte, das bereits einen Überschuss an kapazitiver Erzeugung aufwies; das Korrekturmanöver wurde so zum instrumentellen Auslöser des Zusammenbruchs, obwohl die strukturelle Verwundbarkeit bereits vorher bestand."
  },
  {
    "id": "emergent-norm-theory",
    "letter": "E",
    "term": "Emergent Norm Theory",
    "definition": "Soziologische Theorie von Turner und Killian, die beschreibt, wie soziale Gruppen in Situationen kollektiver Störung spontan neue adaptive Verhaltensnormen entwickeln, die das Verhalten in Abwesenheit der üblichen institutionellen Strukturen leiten – im Gegensatz zur klassischen Sichtweise von Massenpanik und kollektiver Irrationalität. Der 28-A lieferte Felddaten, die diese Theorie bestätigen: In Abwesenheit institutioneller Kommunikation während der ersten Stunden entwickelte die Bevölkerung spontane Kooperationsverhalten – manuelle Verkehrsregelung, gegenseitige Hilfe bei blockierten Aufzügen, informelle Informationsnetzwerke zwischen Nachbarn –, die die Auswirkungen des Informationsvakuums teilweise abmilderten und die Schwere direkter Personenschäden über das hinaus minimierten, was auf Panik basierende Krisenmodelle vorhergesagt hätten."
  },
  {
    "id": "encuadre-mediatico-framing-y-agenda-shifting",
    "letter": "M",
    "term": "Medien-Framing und Agenda-Shifting",
    "definition": "Framing ist der kognitive und redaktionelle Prozess, bei dem Medien bestimmte Elemente eines Ereignisses auswählen und betonen, um eine spezifische kausale Interpretation vorzuschlagen und bestimmte Lesarten gegenüber anderen zu privilegieren. Agenda-Shifting ist das komplementäre Phänomen, bei dem ein disruptives Ereignis mit hoher Sichtbarkeit instrumentalisiert wird, um bereits bestehende politische oder strukturelle Debatten wiederzueröffnen. Der 28-A war ein Paradebeispiel für beides: Derselbe Blackout wurde gleichzeitig als Beweis für die „Fragilität der Erneuerbaren“, als Beleg für die „Unzulänglichkeit der europäischen Vernetzung“, als Argument für den „Erhalt der Kernkraft“ und als Folge der „regulatorischen Nachlässigkeit der Regierung“ geframed – je nach Medium und Zielpublikum. Jedes Framing wählte reale Aspekte des Vorfalls aus und konstruierte daraus kausale Narrative, die die spätere technische Untersuchung in unterschiedlichem Maße bestätigen, modifizieren oder widerlegen würde, deren öffentliche Rezeption jedoch bereits lange vor der Veröffentlichung einer rigorosen Analyse festgelegt war."
  },
  {
    "id": "entso-e",
    "letter": "E",
    "term": "ENTSO-E",
    "definition": "Das Europäische Netz der Übertragungsnetzbetreiber für Elektrizität (ENTSO-E) vereint 40 ÜNB aus 36 europäischen Ländern mit einem Mandat aus den EU-Rechtsakten zur Gewährleistung der Betriebssicherheit des kontinentalen Synchronverbunds, zur Erleichterung der Integration erneuerbarer Energien und zur Festlegung verbindlicher Netzanschlussregeln für die Mitgliedstaaten. Zu seinen Aufgaben gehören die Echtzeit-Betriebskoordination über die RCCs, die Veröffentlichung der Europäischen Netzentwicklungspläne (TYNDP) und die Ausarbeitung technischer Network Codes. Der 28-A löste bei der ENTSO-E eine beispiellos schnelle regulatorische Reaktion aus: Der Entwurf des NC RfG 2.0 – der die verpflichtende Einführung von GFM-Fähigkeiten für Anlagen ≥ 1 MW vorsieht – wurde im November 2025 veröffentlicht, nur sieben Monate nach dem Zusammenbruch, was die Dringlichkeit widerspiegelt, mit der die europäische Fachgemeinschaft die durch den iberischen Vorfall offengelegten Hinweise auf systemische Verwundbarkeit verarbeitete."
  },
  {
    "id": "ers-essential-reliability-services-servicios-esenciales-de-confiabilidad",
    "letter": "E",
    "term": "ERS (Essential Reliability Services)",
    "definition": "Gesamtheit unverzichtbarer physikalischer Eigenschaften für den sicheren und resilienten Betrieb des Stromsystems, die ohne explizites regulatorisches Signal nicht vom Energiemarkt bereitgestellt werden können: rotatorische Trägheit (oder ihr synthetisches Äquivalent), Kurzschlussleistung, primäre Frequenzregelung (FFR/FCR) und dynamische Spannungs- und Blindleistungsregelung. Im traditionellen Synchrongeneratorsystem waren diese Dienstleistungen automatische Nebenprodukte des normalen Betriebs der Generatoren – niemand beauftragte sie, weil niemand sie beauftragen musste; im IBR-dominierten System müssen sie explizit entworfen, konfiguriert und vergütet werden. Der 28-A war die kostspieligste empirische Demonstration, dass die Energiewende ohne einen ERS-Markt systemische Externalitäten erzeugt, deren Kosten – für den iberischen Vorfall auf 1.000 bis 1.500 Mio. € geschätzt – die Kosten der aufgeschobenen präventiven Regulierung bei weitem übersteigen. Das RD 997/2025 und der NC RfG 2.0 der ENTSO-E sind die direkte Antwort auf diese Erkenntnis."
  },
  {
    "id": "estabilidad-de-tension",
    "letter": "S",
    "term": "Spannungsstabilität",
    "definition": "Fähigkeit eines Elektrizitätssystems, die Spannungsniveaus an allen seinen Knoten sowohl im stationären Zustand als auch nach Störungen innerhalb der normativen Betriebsgrenzen zu halten, was den kontinuierlichen Ausgleich zwischen dem Blindleistungsbedarf der Lasten und der induktiven Leitungen und der Blindleistungsbereitstellung durch Generatoren, Kompensatoren und die verteilte Kapazität der Leitungen erfordert. Im Gegensatz zur Frequenzstabilität – die vom Wirkleistungsgleichgewicht abhängt und ein im Wesentlichen systemweites Phänomen ist – ist die Spannungsstabilität lokal: Sie kann in einer Zone zusammenbrechen, während der Rest des Systems normal arbeitet. Der 28-A war ein Spannungsstabilitätszusammenbruch, kein Frequenzzusammenbruch; die Unterscheidung ist nicht akademisch, sondern definiert, welche Schutzmechanismen wirksam sind und welche – wie der UFLS, der für Wirkleistungsdefizite ausgelegt ist – sich als kontraproduktiv erweisen, wenn sie auf das falsche Szenario angewendet werden."
  },
  {
    "id": "estabilizadores-del-sistema-de-potencia-pss",
    "letter": "L",
    "term": "Leistungssystemstabilisatoren (PSS)",
    "definition": "Zusätzliche Regelkreise, die im Erregersystem von Synchrongeneratoren installiert werden und aktive elektrische Dämpfung für niederfrequente elektromechanische Schwingungen (0,1–2 Hz) bereitstellen, die aus der dynamischen Wechselwirkung zwischen geografisch entfernten Maschinen entstehen. Sie arbeiten, indem sie ein Rückkopplungssignal – abgeleitet von der Rotorwinkelgeschwindigkeit oder der elektrischen Leistung – mit der geeigneten Phasenverschiebung in den automatischen Spannungsregler (AVR) einspeisen, sodass die Generatorantwort der Schwingung entgegenwirkt, anstatt sie zu verstärken. Der fortschreitende Rückgang des synchronen Kraftwerksparks auf der Halbinsel führt zum kumulativen Verlust aktiver PSS – jedes stillgelegte Kraftwerk nimmt seinen Beitrag zur Systemdämpfung mit sich – und verschlechtert den Dämpfungsgrad der Zwischengebietsmoden; der 28-A zeigte dieses Dämpfungsdefizit durch die in den Aufzeichnungen vor dem Zusammenbruch detektierte 0,6-Hz-Schwingung."
  },
  {
    "id": "estrategia-brownfield",
    "letter": "B",
    "term": "Brownfield-Strategie",
    "definition": "In der Energietechnik die Umrüstung bestehender Industrieanlagen – stillgelegte Wärmekraftwerke, Kernkraftwerke im Stilllegungsprozess, große außer Betrieb genommene Erzeugungsumspannwerke –, um ihnen neue systemische Funktionen zu geben, unter Erhalt der zivilen Infrastruktur, des Umspannwerks und der bereits gebauten Ableitungsleitungen. Im Kontext nach dem 28A besteht die relevanteste Anwendung darin, die Generatoren dieser Anlagen in reine Synchronkompensatoren umzuwandeln, indem der Rotor von der Turbine entkoppelt und die Maschine ausschließlich für den Austausch von Blindleistung und Trägheit betrieben wird. Die Vorteile sind quantifizierbar: Die Implementierungszeit verkürzt sich von 4–6 Jahren bei einer Neuanlage auf 18–24 Monate, und die Kapitalkosten können 40–60 % niedriger sein. Da die größten Defizite an Trägheit und Kurzschlussleistung nach dem 28A genau in den Gebieten konzentriert sind, in denen Wärmekraftwerke stillgelegt wurden, hat die Brownfield-Strategie den zusätzlichen Vorteil, die Dienste genau dort bereitzustellen, wo sie am dringendsten benötigt werden. *(Siehe auch Eintrag 106 für die erweiterte Version.)*"
  },
  {
    "id": "fast-frequency-response-ffr",
    "letter": "F",
    "term": "Fast Frequency Response (FFR)",
    "definition": "Subzyklischer Stabilisierungsdienst, der einen Block Wirkleistung in das kritische Zeitfenster vor dem Eingreifen der konventionellen mechanischen Regler (FCR) einspeist, typischerweise in den ersten 200–250 ms nach der Störung, wenn der RoCoF am höchsten ist und das Risiko der Aktivierung von Inselnetzschutzmaßnahmen am größten ist. Während die Primärregelung in der Größenordnung von 5–30 Sekunden wirkt, reagiert der FFR in der Größenordnung einer halben Netzfrequenzperiode, was in Systemen mit geringer Trägheit, in denen derselbe Erzeugungsausfall viel höhere RoCoF-Werte verursacht, wesentlich ist. Der 28A zeigte, dass der spanische Rahmen für Systemdienstleistungen kein reguliertes und vergütetes FFR-Produkt vorsah; der Zusammenbruch selbst war spannungsbedingt – nicht das Zielszenario des FFR –, aber das Fehlen einer koordinierten subzyklischen Antwort ließ das System während der kritischen Phase ohne dynamische Anker."
  },
  {
    "id": "frecuencia-nominal",
    "letter": "N",
    "term": "Nennfrequenz",
    "definition": "Referenzwert der Frequenz des kontinentaleuropäischen Verbundsystems: 50 Hz, festgelegt durch die ENTSO-E-Normen und die P.O. 1.1 des spanischen Systems. Die Betriebsgrenzen definieren Zonen zunehmender Schwere: Normalbetrieb in [49,0–51,0] Hz; Alarm in [48,5–49,0] Hz und [51,0–51,5] Hz; Notfall unter 47,5 Hz oder über 51,5 Hz. Der 28A veranschaulichte ein kontraintuitives Phänomen für Betreiber, die darauf trainiert sind, den Zusammenbruchsalarm mit einer Frequenzabweichung zu assoziieren: Die Systemfrequenz blieb während der kritischen Sekunden relativ nahe bei 50 Hz, weil der dominierende Mechanismus der Spannungskollaps war, nicht das Wirkleistungsungleichgewicht; die schwere Frequenzabweichung zeigte sich erst in den letzten Augenblicken, als die Generatoren infolge des bereits vollendeten Spannungskollapses begannen, sich abzuschalten."
  },
  {
    "id": "gfl-grid-following",
    "letter": "G",
    "term": "GFL (Grid-Following)",
    "definition": "Wechselrichter-Regelungsstrategie, bei der das Gerät als gesteuerte Stromquelle arbeitet, die sich über einen Phase-Locked Loop (PLL) passiv mit der Spannung und Frequenz des Netzes synchronisiert. Sein Vorteil ist die einfache Implementierung und die niedrigen Kosten; seine strukturelle Einschränkung ist die absolute Abhängigkeit von einem stabilen externen Netz, das die Phasenreferenz liefert: In schwachen Netzen (SCR < 2) gerät der PLL mit negativer Dämpfung (ζ_PLL < 0) in Instabilität, und der Wechselrichter verliert die Synchronisation. Am 28A arbeiteten 78–82 % des iberischen IBR-Parks im GFL-Modus: Als die Spannung zu oszillieren begann, verloren die PLLs tausender Wechselrichter fast gleichzeitig die Referenz, schalteten die Einheiten ab und entzogen schlagartig die verbleibende geringe Blindleistungsunterstützung. Die Vorherrschaft des GFL war kein individueller Designfehler, sondern das kumulative Ergebnis jahrzehntelanger Netzanschlussbedingungen, die – weil ihr Bedarf nicht vorhergesehen worden war – keine netzbildenden Fähigkeiten verlangten."
  },
  {
    "id": "gfm-grid-forming",
    "letter": "G",
    "term": "GFM (Grid-Forming)",
    "definition": "Wechselrichter-Regelungsstrategie, bei der das Gerät als ideale Spannungsquelle hinter einer virtuellen Impedanz arbeitet, die Amplitude und Frequenz seines Ausgangs autonom erzeugt, ohne eine externe Referenz zu benötigen: Es kann in schwachen Netzen (SCR < 1,5) betrieben werden, konfigurierbare synthetische Trägheit bereitstellen, das Netz autonom stützen und einen kontrollierten Fehlerstrom einspeisen. Der NC RfG 2.0 der ENTSO-E (November 2025) schlägt vor, GFM für alle Erzeugungs- oder Speichermodule ≥ 1 MW verbindlich zu machen; das RD 997/2025 setzt in Spanien das Ziel von 22,5 GW GFM-Speicher bis 2030. Wenn der 28A die Frage aufwarf – was wäre mit einem von GFM dominierten Park passiert? –, liefern die Simulationen des IIT-Comillas-Berichts die Antwort: Die Kaskade wäre eingedämmt oder zumindest signifikant verzögert worden, weil die GFM-Wechselrichter die Spannung gehalten hätten, anstatt das Netz im Moment des größten Bedarfs zu verlassen."
  },
  {
    "id": "headroom-reserva-de-capacidad-del-inversor",
    "letter": "H",
    "term": "Headroom (Wechselrichter-Leistungsreserve)",
    "definition": "Anteil der maximalen Scheinleistung (S_max), den ein GFM-Wechselrichter im stationären Betrieb bewusst ungenutzt für die Wirkleistungseinspeisung lassen muss, um ausreichend Spielraum für die Reaktion auf schnelle Spannungs- oder Frequenztransienten zu haben, ohne die Leistungselektronik zu sättigen. Diese Reserve ist im Wesentlichen der physische Preis der dynamischen Stabilität: Ein GFM-Wechselrichter, der zu 100 % seiner Wirkleistungskapazität arbeitet, kann bei einer Störung keine zusätzliche Blindleistung einspeisen, ohne seine Stromgrenzen zu verletzen. Der wirtschaftliche Konflikt ist offensichtlich – Headroom ist nicht auf dem Energiemarkt verkaufte Wirkleistung –, und genau diese nicht vergütete Externalität rechtfertigt die Schaffung von Märkten für Essential Reliability Services (ERS): Ohne explizite Vergütung hat kein Betreiber einen Anreiz, Headroom vorzuhalten, und dem System fehlt der Handlungsspielraum, den der 28A als unverzichtbar erwiesen hat. *(Siehe auch Eintrag 110 für die erweiterte Version.)*"
  },
  {
    "id": "hvdc-high-voltage-direct-current",
    "letter": "H",
    "term": "HVDC (High Voltage Direct Current)",
    "definition": "Hochspannungs-Gleichstrom-Übertragungstechnologie, die im Gegensatz zur Wechselstromübertragung keine Phasensynchronität zwischen den Enden der Verbindung erfordert und eine unabhängige und präzise Steuerung des Wirkleistungsflusses in beide Richtungen ermöglicht. Zu den Hauptanwendungen gehören die Verbindung asynchroner Systeme, die Übertragung über sehr große Entfernungen mit geringen Verlusten und Seekabel. Im Kontext des 28A wird das praktische Fehlen von HVDC-Kapazität zwischen der Iberischen Halbinsel und dem kontinentalen System als einer der strukturellen Faktoren genannt, die das Ausmaß des Zusammenbruchs verstärkten: Eine HVDC-Verbindung mit ausreichender Kapazität hätte während der Anfangsphasen der Instabilität Wirkleistung und Spannungsunterstützung aus Frankreich importieren können, unabhängig vom Synchronzustand der beiden Systeme, der genau die Bedingung war, die die transpyrinäen Wechselstromverbindungen außer Kraft setzte."
  },
  {
    "id": "ibr-inverter-based-resources",
    "letter": "I",
    "term": "IBR (Inverter-Based Resources)",
    "definition": "Erzeugungs- oder Speicherressourcen, die ausschließlich über Leistungselektronik an das Wechselstromnetz angeschlossen werden, ohne direkte elektromechanische Kopplung mit dem Synchronsystem; die Kategorie umfasst Photovoltaik, Windkraftanlagen der Typen 3 und 4, BESS-Systeme, STATCOM, SVC und die Wandler von HVDC-Verbindungen. Am 28A entfielen 82 % der momentanen iberischen Erzeugung auf IBR-Ressourcen (Bericht des Analyseausschusses, S. 38). Die Konzentration von IBR-Anlagen, die mit GFL-Strategien betrieben werden – ohne die Fähigkeit, Trägheit beizusteuern oder die Spannung in schwachen Netzen zu stützen –, ist der zentrale technische Faktor, der eine Störung, die in einem System mit größerer dynamischer Robustheit beherrschbar gewesen wäre, in einen totalen systemischen Zusammenbruch verwandelte: Nicht die Menge der Erneuerbaren versagte, sondern ihre Steuerungsarchitektur."
  },
  {
    "id": "igbt-insulated-gate-bipolar-transistor",
    "letter": "I",
    "term": "IGBT (Insulated Gate Bipolar Transistor)",
    "definition": "Leistungshalbleiter, der die hohe Eingangsimpedanz des Feldeffekttransistors mit dem niedrigen Durchlasswiderstand des Bipolartransistors kombiniert und so das effiziente Schalten großer Ströme bei Frequenzen von 1–20 kHz ermöglicht. Er ist das grundlegende aktive Bauelement moderner Wechselrichter, aus denen der iberische IBR-Park besteht. Seine Schaltfähigkeit im Mikrosekundenbereich ermöglicht es einem GFL-Wechselrichter, eine Spannungsstörung zu erkennen und seinen Ausgang in weniger als einer Netzperiode (20 ms) abzuschalten: Dieselbe Geschwindigkeit, die den IGBT als Wandlerelement so effizient macht, ermöglichte es Tausenden von Wechselrichtern, bei der Überspannung am 28A kaskadenartig auszulösen und den Zusammenbruch in nur 30 Sekunden zu vollenden. Schnelligkeit ist kein neutrales Attribut; im falschen Kontext ist sie die Geschwindigkeit der Katastrophe."
  },
  {
    "id": "impedancia-de-transferencia",
    "letter": "B",
    "term": "Übertragungsimpedanz",
    "definition": "In elektrischen Energiesystemen quantifiziert die Impedanz zwischen zwei Knoten den elektrischen Widerstand gegen den Leistungsfluss zwischen ihnen und bestimmt, wie stark sich die Spannung an einem Knoten ändert, wenn die Einspeisung am anderen geändert wird. Eine hohe Übertragungsimpedanz bedeutet ein schwach gekoppeltes Netz: Leistungsänderungen verursachen große Spannungs- und Winkeländerungen, verschlechtern die Festigkeit des Systems und machen die PLL-Regelung von GFL-Wechselrichtern instabil. Die Übertragungsimpedanz zwischen der Iberischen Halbinsel und dem kontinentalen System ist aufgrund des Engpasses der transpyrinäen Verbindung – nur etwa 3 % des iberischen Bedarfs in Bezug auf die NTC – strukturell hoch, was bedeutet, dass das iberische System sich nicht in dem Maße elektrische Steifigkeit vom kontinentalen Netz „ausleihen“ kann, wie es andere Grenzsysteme können. Der 28A machte deutlich, dass diese strukturelle Schwäche reale und messbare dynamische Konsequenzen in Bezug auf den SCR hat."
  },
  {
    "id": "infodemia",
    "letter": "I",
    "term": "Infodemie",
    "definition": "Beschleunigte und massive Verbreitung von ungeprüften, fehlerhaften oder direkt falschen Inhalten im Informationsraum, die mit verifizierten Informationen konkurrieren und sowohl institutionelle als auch bürgerliche Entscheidungsfindung erschweren; ein von der WHO populär gemachter Begriff, der auf jede Krise mit hoher medialer Sichtbarkeit anwendbar ist. Soziale Medien wirken als strukturelle Verstärker, indem sie die Verbreitung von Inhalten mit hoher emotionaler Wirkung unabhängig von ihrer Wahrheit optimieren. Der 28A erzeugte in den ersten Stunden eine Infodemie nach Lehrbuch: Hypothesen über Cyberangriffe, Bilder angeblicher Explosionen in Umspannwerken, Behauptungen über den solaren Ursprung des Zusammenbruchs und Zuschreibungen an ausländische staatliche Akteure zirkulierten mit Millionen von Interaktionen, bevor irgendeine vorläufige technische Analyse veröffentlicht worden war, und verankerten im kollektiven Bewusstsein Interpretationsrahmen, die die spätere technische Genauigkeit kaum noch verdrängen konnte."
  },
  {
    "id": "inercia-sintetica-virtual-inertia",
    "letter": "S",
    "term": "Synthetische Trägheit (Virtual Inertia)",
    "definition": "Regelungsalgorithmus, der in GFM-Wechselrichtern implementiert ist und mathematisch die Schwingungsgleichung des Rotors einer Synchromaschine nachbildet: Er misst die zeitliche Ableitung der Frequenz (df/dt oder RoCoF) und passt die eingespeiste Leistung proportional zu dieser Ableitung an, wodurch der dämpfende Effekt der rotierenden Masse bei Frequenzstörungen nachgeahmt wird. Sein Vorteil gegenüber physikalischer Trägheit ist, dass die synthetische Trägheitskonstante (H_virtual) ein einstellbarer Softwareparameter ist, keine unveränderliche physikalische Eigenschaft des Geräts. Seine Einschränkung ist die Abhängigkeit vom zugrunde liegenden Speicher: Wenn der BESS mit niedrigem Ladezustand arbeitet, ist die verfügbare synthetische Trägheit physikalisch durch die gespeicherte Energie begrenzt. Am 28A war das fast vollständige Fehlen von Trägheit – synthetisch oder real – im Süden der Halbinsel die Bedingung, die die Reaktionszeit des Systems auf die anfängliche Störung eliminierte und eine Spannungsschwingung in eine irreversible Kaskade verwandelte."
  },
  {
    "id": "low-voltage-ride-through-lvrt",
    "letter": "L",
    "term": "Low Voltage Ride Through (LVRT)",
    "definition": "Fähigkeit, die von IBR-Wechselrichtern gefordert wird, während eines Spannungseinbruchs verbunden zu bleiben und unterstützende Blindleistung einzuspeisen, anstatt sich durch Schutzabschaltung zu trennen. Die LVRT-Anforderungen in Spanien sind in der P.O. 12.3 geregelt und umfassen den dynamischen Parameter k (Proportionalitätsfaktor zwischen dem eingespeisten Blindstrom und der Einbruchtiefe). Das LVRT-Design geht von einem Netz mit ausreichender elektrischer Steifigkeit aus, damit die Blindleistungseinspeisung des Wechselrichters die Spannung am Anschlusspunkt tatsächlich anhebt. Der 28A zeigte die Einschränkung im umgekehrten Szenario: In Netzen mit SCR < 2 kann die massive Einspeisung kapazitiver Blindleistung gemäß den klassischen LVRT-Profilen eine bereits erhöhte Spannung weiter anheben, die Instabilität verstärken anstatt sie einzudämmen, und erfordert eine grundlegende Überarbeitung der Koordination zwischen dem LVRT-Profil und der Netzfrequenz. *(Siehe auch HVRT, Eintrag 112.)*"
  },
  {
    "id": "mallado",
    "letter": "V",
    "term": "Vermaschung",
    "definition": "Betriebliche Maßnahme der topologischen Rekonfiguration, die die Konnektivität des Netzes durch Schließen von Leistungsschaltern in 400-kV-Leitungen erhöht, indem zuvor getrennte Umspannwerke oder Leitungsabschnitte verbunden werden, mit dem üblichen Ziel, das Spannungsprofil durch Verteilung der Blindleistung auf mehr parallele Pfade zu verbessern. Am 28A aktivierte die von REE durchgeführte Vermaschungsmaßnahme zur Anhebung abgesunkener Spannungen im Süden unbeabsichtigt den Ferranti-Effekt: Durch die Einspeisung von Leitungsabschnitten, die nach dem Schließen leer liefen, injizierte die verteilte Kapazität dieser Abschnitte zusätzliche Blindleistung in ein Netz, das bereits einen Überschuss an kapazitiver Erzeugung aufwies. Die Korrekturmaßnahme wurde so zum instrumentellen Auslöser des Zusammenbruchs, obwohl die strukturelle Verwundbarkeit bereits vor ihr bestand; ohne die vorherigen Bedingungen von degradiertem SCR und niedriger Trägheit wäre dieselbe Vermaschung eine routinemäßige Betriebsmaßnahme gewesen."
  },
  {
    "id": "nc-rfg-network-code-on-requirements-for-generators",
    "letter": "N",
    "term": "NC RfG (Network Code on Requirements for Generators)",
    "definition": "Europäischer Netzkodex der ENTSO-E, der die verbindlichen technischen Anforderungen für den Anschluss von Erzeugungsanlagen an das Übertragungsnetz harmonisiert und die Module je nach Leistung und systemischer Auswirkung in drei Kategorien (A, B, C) einteilt. Die Originalversion (EU-Verordnung 2016/631) wurde grundlegend für synchrone Erzeugung konzipiert und berücksichtigte nicht explizit die Anforderungen an die Netzbildung für IBR. Die Version 2.0, vorgeschlagen im November 2025 – direkt motiviert durch die Schlussfolgerungen der Untersuchung des 28A –, führt als verbindliche Anforderung die GFM-Fähigkeit für alle Module ≥ 1 MW ein, zusammen mit neuen Kriterien für einen minimalen SCR/MRSCR am Anschlusspunkt: Es ist die tiefgreifendste Reform der europäischen Netzkodizes seit Inkrafttreten des Pakets für saubere Energie, und der 28A war ihre technische Rechtfertigung."
  },
  {
    "id": "oscilaciones-electromecanicas",
    "letter": "E",
    "term": "Elektromechanische Schwingungen",
    "definition": "Oszillatorische Moden des elektrischen Systems, die aus der dynamischen Wechselwirkung zwischen den Rotoren geografisch verteilter Synchrongeneratoren entstehen: Wenn die elektrische Leistung abrupt variiert, schwingen die Rotoren – die aufgrund ihrer Trägheit ihre Geschwindigkeit nicht sofort ändern können – mit charakteristischen Frequenzen gegeneinander. Lokale Moden (0,7–2 Hz) betreffen Generatoren derselben Region; Inter-Area-Moden (0,1–0,7 Hz) betreffen Maschinengruppen verschiedener Regionen. Am 28. April registrierten die PMU in den Minuten vor dem Zusammenbruch eine Inter-Area-Schwingung bei 0,6 Hz mit reduzierter Dämpfung – ein Signal, das im Nachhinein darauf hindeutete, dass das System bereits vor der Auslösung, die die Kaskade auslöste, unter dynamischem Stress stand und dass der fortschreitende Rückgang des synchronen Parks – mit seinen zugehörigen PSS – die Fähigkeit des Systems, diese Schwingung zu dämpfen, verschlechtert hatte."
  },
  {
    "id": "oscilaciones-forzadas-y-naturales",
    "letter": "E",
    "term": "Erzwungene und natürliche Schwingungen",
    "definition": "Natürliche Schwingungen sind die elektromechanischen Eigenmoden des Systems, deren Frequenz durch die Trägheit der Maschinen und die Netzkonstanten bestimmt wird; sie werden durch jede Störung angeregt und werden je nach Dämpfungsfaktor der Mode gedämpft oder nicht. Erzwungene Schwingungen werden durch eine periodische externe Störung induziert, typischerweise eine fehlerhafte Regelschleife in einem bestimmten Gerät, deren Frequenz nicht unbedingt mit einer natürlichen Mode übereinstimmt, diese aber bei Resonanz anregen kann. Die Unterscheidung ist betrieblich kritisch: Eine natürliche Schwingung erfordert eine Erhöhung der Systemdämpfung (PSS, POD); eine erzwungene Schwingung erfordert die Identifizierung und Beseitigung der Anregungsquelle. Am 28. April wurde in der späteren Untersuchung analysiert, ob die erkannte Schwingung bei 0,6 Hz eine schlecht gedämpfte natürliche Mode – Folge der geringen Synchrondichte – oder eine erzwungene Schwingung durch ein Gerät mit anomalem Verhalten vor dem Zusammenbruch war."
  },
  {
    "id": "outrage-communication-comunicacion-de-indignacion",
    "letter": "O",
    "term": "Outrage-Kommunikation (Empörungskommunikation)",
    "definition": "Konzept aus dem Risikomodell von Peter Sandman – Risk = Hazard + Outrage –, das besagt, dass die öffentliche Wahrnehmung eines Vorfalls nicht nur von der technischen Größe der Gefahr (Hazard) abhängt, sondern in größerem Maße von emotionalen und kontextuellen Faktoren: Wahrnehmung von Freiwilligkeit, Fairness, institutioneller Transparenz und Empörung über mögliche Fahrlässigkeit. Der 28. April erzeugte unabhängig von der zugrunde liegenden technischen Ursache außergewöhnlich hohe Outrage-Werte: Ein Blackout von 15.000 MW an einem normalen Werktag, ohne historischen Präzedenzfall in Westeuropa, aktiviert emotionale Mechanismen, die keine spätere technische Erklärung vollständig deaktivieren kann. Die öffentliche Wahrnehmung regulatorischer Fahrlässigkeit verstärkte die Empörung weit über das hinaus, was die technische Bewertung des Hazards gerechtfertigt hätte, mit politischen Konsequenzen, die das Ausmaß des dokumentierten materiellen Schadens bei weitem überstiegen."
  },
  {
    "id": "pniec-plan-nacional-integrado-de-energia-y-clima",
    "letter": "P",
    "term": "PNIEC (Integrierter nationaler Energie- und Klimaplan)",
    "definition": "Spanischer Energieplanungsrahmen, der die Dekarbonisierungsziele, den Erneuerbaren-Anteil und die Energieeffizienzziele für den Horizont 2030 in Übereinstimmung mit den Zielen des Europäischen Grünen Deals festlegt. Die Version vor dem 28. April prognostizierte einen Erneuerbaren-Anteil von 74 % am Strommix bis 2030, mit einer fortschreitenden Reduzierung der synchronen thermischen Erzeugung. Der 28. April stellte die Penetrationsziele des PNIEC nicht in Frage – die Ursache des Zusammenbruchs war nicht ein Überschuss an Erneuerbaren, sondern ein Mangel an dynamischer Robustheit –, zeigte jedoch, dass der Umsetzungsfahrplan keinen ausreichend detaillierten Parallelplan zur Sicherstellung der wesentlichen Zuverlässigkeitsdienste enthielt, während die synchrone Erzeugung zurückgefahren wurde, was die Aktualisierung des PNIEC zu einer dringenden regulatorischen Notwendigkeit machte."
  },
  {
    "id": "potencia-de-cortocircuito-ssc",
    "letter": "K",
    "term": "Kurzschlussleistung (Ssc)",
    "definition": "Größe, die die elektrische Steifigkeit eines Netzknotens misst: Sie repräsentiert den Scheinstrom, der bei einem dreipoligen Kurzschluss in diesen Knoten fließen würde, und ist direkt proportional zur Anzahl und Leistung der elektrisch nahen Synchrongeneratoren und -kompensatoren. Eine hohe Ssc bedeutet, dass kleine Änderungen der eingespeisten Leistung zu minimalen Spannungsänderungen führen („starker“ Knoten); eine niedrige Ssc bedeutet, dass Leistungsänderungen zu großen Spannungsänderungen führen („schwacher“ Knoten), was die PLL-Regelung von GFL-Wechselrichtern instabil macht. Am 28. April arbeiteten die Knoten im Süden der Halbinsel – einem Gebiet mit hoher IBR-Konzentration und geringer Synchrongeneratordichte – mit unzureichenden Kurzschlussleistungen, um die Dynamik der angeschlossenen Wechselrichter zu stützen, ein Zustand, den der IIT-Comillas-Bericht mit dem für dieses Gebiet zum Zeitpunkt des Zusammenbruchs dokumentierten SCR < 2 widerspiegelt. *(Siehe auch Eintrag 105.)*"
  },
  {
    "id": "power-system-stabilizers-y-power-oscillation-damping-pss-pod",
    "letter": "P",
    "term": "Power System Stabilizers und Power Oscillation Damping (PSS/POD)",
    "definition": "Zusätzliche Steuermodule, die in den Erregersystemen von Synchrongeneratoren (PSS) oder in den Regelkreisen von GFM-Wechselrichtern (POD) installiert sind, um den elektromechanischen Schwingungen des Systems aktive Dämpfung hinzuzufügen, indem sie gegenphasige Signale einspeisen, die den erkannten Schwingungen entgegenwirken. PSS leiten ihr Signal von der Rotorwinkelgeschwindigkeit oder der elektrischen Leistung ab; POD in GFM-Wechselrichtern tun dies äquivalent durch Modulation der Blindleistung. Der fortschreitende Rückgang des synchronen Parks auf der Halbinsel führt zu einem kumulativen Verlust aktiver PSS, was den Dämpfungsfaktor der Inter-Area-Moden verschlechtert; der 28. April warf dringend die Frage auf, ob POD-Systeme in GFM-Wechselrichtern diesen Verlust quantitativ kompensieren können oder ob die Systemdämpfung eine Mindestdichte an Synchromaschinen erfordert, die Wechselrichter aufgrund ihrer Natur nicht vollständig replizieren können."
  },
  {
    "id": "procedimiento-de-operacion-1-6-p-o-1-6",
    "letter": "B",
    "term": "Betriebsverfahren 1.6 (P.O. 1.6)",
    "definition": "Notfallprotokoll des spanischen Stromsystems, das die Schutzpläne bei kritischen Vorfällen und die Verfahren zur Wiederherstellung der Versorgung nach einem teilweisen oder vollständigen Spannungseinbruch festlegt. Es definiert die Strategien zur Aufteilung des Netzes in unabhängige elektrische Inseln, die bevorzugten Einspeiserouten von den Black-Start-Knoten und das Protokoll zur Priorisierung des Anlaufs von Erzeugungsanlagen für die sequenzielle Wiederherstellung des Systems. Am 28. April wurde das P.O. 1.6 unter beispiellosen Bedingungen im Betrieb des Festlandnetzes aktiviert: Die geografische Ausdehnung des Zusammenbruchs (das gesamte 400-kV-Netz) und seine Geschwindigkeit (30 Sekunden bis zum Spannungseinbruch) brachten das Protokoll an die Grenzen seiner Auslegungsannahmen und führten zu einer der komplexesten Wiederherstellungsoperationen, die in Westeuropa in den letzten Jahrzehnten durchgeführt wurden."
  },
  {
    "id": "procedimiento-de-operacion-7-4-p-o-7-4",
    "letter": "B",
    "term": "Betriebsverfahren 7.4 (P.O. 7.4)",
    "definition": "Technische Vorschrift des spanischen Stromsystems, die den Regelungsdienst für die Spannungshaltung im Übertragungsnetz regelt und die Verpflichtungen der Erzeuger zur Aufnahme oder Einspeisung von Blindleistung (Q) gemäß den Vorgaben des Systembetreibers sowie die Zielspannungsbänder, Reaktionszeiten und Sanktionsmechanismen bei Nichteinhaltung festlegt. Der 28. April eröffnete die regulatorische Debatte darüber, ob das P.O. 7.4 – entwickelt in einem Umfeld überwiegend synchroner Erzeugung mit Q-Reaktionsdynamiken von Sekunden bis Minuten – an die Realität eines Erneuerbaren-Parks angepasst ist, der seine Blindleistungsabgabe in Millisekunden ändern kann, oder ob es einer Überarbeitung bedarf, die dynamische Q-Anforderungen integriert, die mit der Geschwindigkeit von Spannungseinbrüchen kompatibel sind, die die hohe IBR-Durchdringung ermöglicht."
  },
  {
    "id": "programa-ds3-de-eirgrid-delivering-a-secure-sustainable-electricity-system",
    "letter": "D",
    "term": "DS3-Programm von EirGrid (Delivering a Secure, Sustainable Electricity System)",
    "definition": "Pionierrahmen für Systemdienstleistungen, entwickelt von EirGrid, um das irische Inselnetz mit Echtzeit-Durchdringungen asynchroner erneuerbarer Erzeugung von bis zu 75 % zu betreiben. Es führt sechs Kategorien von Stabilitätsprodukten ein – synthetische Trägheit, schnelle Frequenzantwort, dynamische Spannungsregelung, virtuelle Kurzschlussleistung und andere –, die explizit in spezifischen, vom Energiemarkt unabhängigen Märkten vergütet werden. Das DS3 ist der in der regulatorischen Diskussion nach dem 28. April am häufigsten zitierte internationale Referenzpunkt, nicht weil das iberische System mit dem irischen vergleichbar wäre, sondern weil es den Proof of Concept liefert, dass ERS-Märkte implementierbar, finanziell nachhaltig und technisch wirksam sind. Spanien und Portugal beobachteten das DS3 jahrelang als Experiment auf einer peripheren Insel; der 28. April machte es zu einem Modell für dringende Anwendung."
  },
  {
    "id": "protecciones-de-perdida-de-sincronismo-ost",
    "letter": "P",
    "term": "Pendelschutz (Out-of-Step Protection, OST)",
    "definition": "Systemschutzrelais (ANSI-Funktion 78), die entwickelt wurden, um eine schwere Winkeldivergenz zwischen zwei verbundenen elektrischen Gebieten – den sogenannten Polschlupf (pole slip) – zu erkennen und automatisch die Verbindungsleitungen zu öffnen, um Geräteschäden zu begrenzen und zu verhindern, dass sich die asynchrone Schwingung auf den Rest des Systems ausbreitet. Sie arbeiten, indem sie den Zeiger der Scheinimpedanz in der R-X-Ebene verfolgen: Wenn die Zeigerbahn die Mho-Kennlinie mit der für einen Polschlupf typischen Geschwindigkeit und Richtung kreuzt, wird die Öffnung ausgelöst. Am 28. April lösten die ANSI-78-Schutzrelais der Pyrenäenverbindungen um 12:33:21 Uhr MESZ aus, als sie den Synchronismusverlust zwischen der Iberischen Halbinsel und dem kontinentaleuropäischen System erkannten. Die Aktion war technisch korrekt – sie verhinderte strukturelle Schäden an den Geräten – und war im Ereignisprotokoll auch die formale Bestätigung des iberischen Systemzusammenbruchs."
  },
  {
    "id": "ree-red-electrica-de-espana",
    "letter": "R",
    "term": "REE (Red Eléctrica de España)",
    "definition": "Spanischer Übertragungsnetzbetreiber (TSO), ein öffentliches Unternehmen, das für das Echtzeitmanagement des Hochspannungs-Übertragungsnetzes auf der Iberischen Halbinsel und den Inseln verantwortlich ist, mit der Verpflichtung, den diskriminierungsfreien Netzzugang und die Versorgungssicherheit zu gewährleisten. Am 28. April war REE gleichzeitig der zentrale operative Akteur des Vorfalls – verantwortlich für die Manöver vor dem Zusammenbruch und die anschließende Wiederherstellungsoperation – und das Hauptobjekt der späteren Untersuchung: Die Fragen, welche Informationen der Betreiber in Echtzeit hatte, welche Entscheidungen er traf, in welchem Zeitfenster er sie traf und welche Alternativen er hatte, bilden den technischen und regulatorischen Kern der Kontroverse, die der Vorfall eröffnete."
  },
  {
    "id": "regimen-de-renovables-cogeneracion-y-residuos-rcr",
    "letter": "R",
    "term": "Regime für Erneuerbare, Kraft-Wärme-Kopplung und Abfälle (RCR)",
    "definition": "Regulatorischer Rahmen des spanischen Stromsystems, der die Anlagen zur Stromerzeugung aus dekarbonisierten Quellen – Photovoltaik, Wind, Laufwasser, Biomasse, hocheffiziente KWK und Siedlungsabfälle – zusammenfasst und die spezifischen Vergütungsmechanismen festlegt, die die Rentabilität dieser Anlagen über die Einnahmen aus dem Großhandelsmarkt hinaus garantieren. Das RCR ist das Instrument, das den massiven Ausbau des erneuerbaren Parks auf der Halbinsel auf die Penetrationsniveaus vorantrieb, die den Kontext des 28. April prägen; die regulatorische Kritik nach dem Vorfall weist darauf hin, dass das RCR die erzeugte Energie vergütet, nicht aber die Systemdienstleistungen, die die Anlagen gleichzeitig erbringen sollten, und damit die Externalität erzeugt, die der Vorfall sichtbar machte."
  },
  {
    "id": "reles-de-comprobacion-de-sincronismo-synchro-check",
    "letter": "S",
    "term": "Synchronprüfrelais (Synchro-check)",
    "definition": "Schutzeinrichtungen (ANSI-Funktion 25), die bei Kupplungsmanövern zwischen getrennten elektrischen Systemen – während des Inselbetriebs oder nach der Wiederherstellung aus dem Black Start – eingesetzt werden. Ihre Funktion besteht darin, zu überwachen, dass Spannung, Frequenz und Phasenwinkel auf beiden Seiten des Kupplungsschalters innerhalb vordefinierter Toleranzen liegen, bevor sie die Schließung autorisieren, um den Einschaltstromstoß und die mechanische Belastung zu vermeiden, die beim Verbinden von Systemen mit signifikanter Phasenverschiebung auftreten würden. Am 28. April spielten die Synchro-check-Relais während der Wiederherstellung eine kritische Rolle: Die sequenzielle Kopplung der wiederhergestellten elektrischen Inseln mit dem kontinentalen System – und unter den wiederhergestellten iberischen Blöcken selbst – erforderte die millimetergenaue Koordination der Synchronbedingungen, um sekundäre Störungen zu vermeiden, die eine bereits außergewöhnlich komplexe Wiederherstellung weiter verzögert hätten."
  },
  {
    "id": "rocof-rate-of-change-of-frequency",
    "letter": "R",
    "term": "RoCoF (Rate of Change of Frequency)",
    "definition": "Zeitliche Ableitung der Frequenz (df/dt, ausgedrückt in Hz/s), die die Geschwindigkeit der Frequenzänderung des Systems bei einem Ungleichgewicht zwischen Erzeugung und Last misst. Sie wird berechnet als RoCoF = −f₀ · ΔP / (2H · S_base), was die inverse Abhängigkeit von der Trägheit H zeigt: Bei geringerer Trägheit erzeugt dasselbe Leistungsungleichgewicht einen höheren RoCoF und ein System, das sich schneller verschlechtert. Es ist der Referenzparameter für die Dimensionierung der subzyklischen Antwort (FFR) und für die Kalibrierung von Inselnetzrelais (ANSI 81R), die auslösen, wenn der RoCoF Schwellenwerte um 0,5 Hz/s überschreitet. Am 28. April blieb der mittlere RoCoF bis 12:33:20 Uhr MESZ unter ±1 Hz/s – was bestätigt, dass der Zusammenbruch keine konventionelle Frequenzinstabilität war – mit geschätzten sekundären Spitzen von ~1,5 Hz/s in 100-ms-Fenstern, die mit den Kaskadenauslösungen der IBR-Anlagen während der Endphase des Spannungseinbruchs zusammenfielen."
  },
  {
    "id": "scr-short-circuit-ratio",
    "letter": "S",
    "term": "SCR (Short-Circuit Ratio)",
    "definition": "Dimensionsloses Verhältnis zwischen der an einem Knoten verfügbaren Kurzschlussleistung (S_ac [MVA]) und der Nennleistung der an diesem Punkt angeschlossenen IBR-Ressource (P_i [MW]): SCR = S_ac / P_i. Es quantifiziert die Netzfestigkeit am Anschlusspunkt des Wechselrichters: SCR > 3 bedeutet starkes Netz; 2 < SCR < 3, schwaches Netz; SCR < 2, sehr schwaches Netz, wo die PLL-Instabilität bei Spannungsänderungen über 5–10 % für GFL-Wechselrichter praktisch unvermeidbar ist. Am 28. April arbeiteten die Knoten im Süden der Halbinsel während der kritischen Stunden mit SCR < 2, ein Zustand, der REE bekannt und in den vor dem Vorfall durchgeführten Studien zur Integration erneuerbarer Energien dokumentiert war: Dieser Zustand verwandelte jede IBR-Anlage in der Region in ein potenziell instabiles Gerät, das nur auf eine ausreichend große Spannungsstörung wartete, um die Kaskade auszulösen, die schließlich eintrat."
  },
  {
    "id": "sincronismo",
    "letter": "S",
    "term": "Synchronismus",
    "definition": "Betriebszustand, bei dem alle an das Netz angeschlossenen Synchrongeneratoren mit derselben elektrischen Winkelgeschwindigkeit (2πf₀ = 314,16 rad/s im europäischen 50-Hz-System) rotieren, mit stabilen Rotorwinkeldifferenzen. Synchronismus ist kein binärer Zustand, sondern ein dynamisches Gleichgewicht: Die Winkeldifferenzen zwischen Maschinen schwanken kontinuierlich, aber das synchronisierende Drehmoment wirkt wie eine Feder, die das System in seinen Gleichgewichtspunkt zurückführt. Der Verlust des Synchronismus bedeutet, dass diese Feder überwunden wurde: Die Rotoren divergieren winkelmäßig ohne Rückkehrmöglichkeit, was die automatische Auslösung von Leistungsschaltern erzwingt, um Schäden zu begrenzen. Am 28. April war der Verlust des Synchronismus zwischen der Iberischen Halbinsel und dem kontinentalen System – formalisiert durch die Auslösung der ANSI-78-Relais um 12:33:21 MESZ – die Grenze zwischen einem schwerwiegenden Vorfall und einem vollständigen Blackout."
  },
  {
    "id": "sistema-voltaire",
    "letter": "V",
    "term": "VOLTAIRE-System",
    "definition": "Von REE implementierte und in das CECRE integrierte Spannungsregelungsarchitektur für die dynamische Spannungsregelung im festländischen System. Sie arbeitet in zwei hierarchischen Ebenen: der sekundären Spannungsregelung (RST), die in Echtzeit Blindleistungssollwerte für die teilnehmenden Generatoren berechnet und ausgibt, um die Pilotspannungen auf Zielwerten zu halten; und der tertiären Spannungsregelung (RTT), die die Blindleistungspläne im Stundenhorizont optimiert. Ihre Algorithmen wurden für die Bewältigung von Spannungsschwankungen im Minutenbereich konzipiert; die iberische Kaskade vollzog sich in 30 Sekunden. Die Frage, ob VOLTAIRE über die erforderliche Regelbandbreite verfügt, um als Abwehrmechanismus gegen schnelle Zusammenbrüche zu wirken – oder ob es durch schneller wirkende systemische Schutzschemas ergänzt werden muss – blieb nach dem 28. April offen."
  },
  {
    "id": "so-gl-system-operation-guidelines",
    "letter": "S",
    "term": "SO GL (System Operation Guidelines)",
    "definition": "Von ENTSO-E veröffentlichte Systembetriebsrichtlinien, die den regulatorischen Rahmen für den sicheren Betrieb des europäischen synchronen Netzes definieren, die Mindestparameter für die Betriebssicherheit und die fünf Schweregrade des Systemzustands festlegen: Normal, Alarm, Notfall, Blackout und Wiederherstellung, mit quantitativen Spannungs- und Frequenzkriterien für den Übergang zwischen den Zuständen. Der 28. April ist aufgrund seines Ausmaßes und seiner Geschwindigkeit der bedeutendste Fall der Aktivierung der Sequenz Blackout → Wiederherstellung im kontinentalen synchronen Netz seit dem italienischen Stromausfall von 2003, und seine Analyse im Rahmen des SO GL hat die Überarbeitung der quantitativen Schwellenkriterien zwischen den Zuständen Alarm und Notfall vorangetrieben."
  },
  {
    "id": "tso-transmission-system-operator",
    "letter": "T",
    "term": "TSO (Transmission System Operator)",
    "definition": "Übertragungsnetzbetreiber: Stelle, die für den Betrieb, die Wartung und den Ausbau des Hochspannungs-Übertragungsnetzes in einem bestimmten Gebiet verantwortlich ist, mit der Verpflichtung, einen diskriminierungsfreien Netzzugang und die Versorgungssicherheit zu gewährleisten. In Spanien fungiert REE als einziger TSO für die Iberische Halbinsel; in Portugal ist REN der nationale TSO; in Frankreich RTE. Die Koordination zwischen den drei TSOs – und ihre Beziehung zum RCC der Region Kontinentaleuropa – war einer der am meisten untersuchten Aspekte in der Analyse nach dem 28. April, da die Ausbreitung des Zusammenbruchs über die Kontrollgrenzen hinweg Koordinationsprotokolle auf die Probe stellte, die nicht für ein Szenario dieses Ausmaßes und dieser Geschwindigkeit ausgelegt waren."
  },
  {
    "id": "ufls-under-frequency-load-shedding",
    "letter": "U",
    "term": "UFLS (Unterfrequenz-Lastabwurf)",
    "definition": "Automatisches systemisches Schutzschema, das gestaffelt Lastblöcke abschaltet, wenn die Frequenz unter vordefinierte Schwellen fällt – im spanischen P.O. 1.6: Pumpen bei 49,5 Hz, Industrielast ab 49,0 Hz –, mit dem Ziel, das Erzeugungs-Last-Gleichgewicht wiederherzustellen, bevor der Frequenzkollaps irreversibel wird. Seine Auslegungslogik geht vom klassischen Szenario aus: Ein großer Generator fällt aus, die Frequenz sinkt, der UFLS schaltet eine entsprechende Last ab, das Gleichgewicht wird wiederhergestellt. Der 28. April zeigte die strukturelle Begrenzung dieser Auslegung im falschen Szenario: Der Zusammenbruch war ein Spannungs-, nicht ein Wirkleistungsproblem; durch das Abschalten induktiver Lasten – genau derjenigen, die die kapazitive Blindleistung aufnahmen, die die Spannung überhöhte – beseitigte der UFLS die letzten verfügbaren Blindleistungssenken und beschleunigte den Zusammenbruch, anstatt ihn zu stoppen. Ein korrekter Schutzmechanismus für das konventionelle Szenario kann genauso schädlich sein wie das Fehlen eines Mechanismus, wenn der Fehler auf der falschen Seite der Stabilität auftritt."
  },
  {
    "id": "vacuum-filling-relleno-del-vacio-informativo",
    "letter": "V",
    "term": "Vacuum Filling (Füllen des Informationsvakuums)",
    "definition": "Struktureller und unvermeidlicher Prozess, bei dem die kollektive Unsicherheit nach einer Katastrophe eine Nachfrage nach Erklärungen erzeugt, die, wenn sie von den Institutionen nicht rechtzeitig und angemessen befriedigt wird, spontan von nicht autorisierten Quellen gedeckt wird, deren Berichte, wenn auch nicht verifiziert, das Vakuum mit emotional kohärenten, wenn auch nicht unbedingt wahren Narrativen füllen. Das Vacuum Filling ist das strukturelle Gegenstück zum Crisis Communication Failure: Beide beschreiben dasselbe Phänomen aus komplementären Perspektiven, ersteres von der Seite des nicht-institutionellen Informationsangebots, letzteres vom Versagen des institutionellen Angebots. Am 28. April machte das Fehlen einer offiziellen technischen Kommunikation in den ersten vier Stunden soziale Medien zum primären Informationsmedium, mit den epistemologischen und politischen Konsequenzen, die die spätere Analyse umfassend dokumentiert."
  },
  {
    "id": "vehicle-to-grid-v2g",
    "letter": "V",
    "term": "Vehicle-to-Grid (V2G)",
    "definition": "Technologie, die die Bidirektionalität des Leistungsflusses zwischen Elektrofahrzeugen und dem Netz ermöglicht, sodass die Batterien von EVs Wirk- und Blindleistung in das Netz einspeisen können, wenn das System dies benötigt, anstatt ausschließlich als Verbraucherlasten zu fungieren. Ihr systemischer Wert liegt nicht nur in der gespeicherten Energie, sondern in der verteilten Steuerbarkeit: Millionen koordinierter bidirektionaler Wechselrichter können synthetische Trägheit, lokale Spannungsunterstützung und Frequenzregelung zu sehr geringen Grenzkosten bereitstellen, da die Batterie bereits im Fahrzeug existiert. Der 28. April zeigte, dass die Zentralisierung der Speicherung – große BESS an Knoten des Übertragungsnetzes – Grenzen bei Zusammenbrüchen hat, die sich schneller ausbreiten als die Kommunikationszeiten der zentralen Steuerung; verteiltes V2G hätte die lokale Dämpfung bieten können, die die zentrale Steuerung nicht liefern konnte, obwohl die derzeitige Hürde nicht technologischer, sondern regulatorischer Natur ist: Bidirektionale Zähler, V2G-Protokolle und tarifliche Anreize für die Teilnahme an Systemdienstleistungen sind die Bedingungen, die der Post-28A-Rahmen schaffen muss."
  },
  {
    "id": "inercia-h",
    "letter": "T",
    "term": "Trägheit (H)",
    "definition": "Die Trägheitskonstante H ist ein dimensionsloser Parameter, der die in den rotierenden Massen eines Synchrongenerators gespeicherte kinetische Energie, normiert auf seine Nennleistung, ausdrückt: H = E_kinetisch [MWs] / S_n [MVA]. In der Praxis stellt sie die Zeit in Sekunden dar, während der der Generator seine Nennlast allein aus der kinetischen Energie seines Rotors speisen könnte, bevor er zum Stillstand kommt. Je größer die Gesamtträgheit des Systems, desto langsamer ist der RoCoF bei einem Leistungsungleichgewicht und desto größer die verfügbare Zeit für das Eingreifen der Regler. Am 28. April arbeitete das festländische System mit einer aggregierten H von etwa 2,3 s, aber mit zonalen Werten von 1,3–1,8 s im Süden – der Zone mit der höchsten IBR-Konzentration und der geringsten Dichte an synchroner Erzeugung –, was bedeutet, dass in dieser Zone die verfügbare Zeit für die Reaktion der Regelmechanismen auf eine Störung weniger als die Hälfte der unter normalen Betriebsbedingungen verfügbaren Zeit betrug: Es gab keinen Spielraum zum Reagieren."
  },
  {
    "id": "potencia-reactiva-q",
    "letter": "B",
    "term": "Blindleistung (Q)",
    "definition": "Komponente der elektrischen Leistung im Wechselstrom, die mit dem Zyklus der Speicherung und Freisetzung von Energie in magnetischen Feldern (Induktivitäten) und elektrischen Feldern (Kondensatoren) verbunden ist, ohne als Nutzarbeit dissipiert zu werden; gemessen in Voltampere reaktiv (VAr). Im Gegensatz zur Wirkleistung ist Blindleistung im Wesentlichen lokal begrenzt und muss in der Nähe ihres Verbrauchs erzeugt werden. Die Blindleistungsbilanz bestimmt das Spannungsprofil des Netzes: Ein Überschuss an kapazitiver Blindleistung – unbelastete Leitungen, unkompensierte Kondensatoren – erhöht die Spannung; ein Defizit senkt sie. Der 28. April war in seinem tiefen Mechanismus ein Problem des Blindleistungsmanagements: Die Vermaschungsmaßnahme im südlichen Netz führte einen Überschuss an kapazitiver Blindleistung ein, den das System – mit reduziertem synchronen Park und IBR-Park ohne robuste Aufnahmefähigkeit unter Überspannungsbedingungen – in der knappen verfügbaren Zeit nicht kompensieren konnte."
  },
  {
    "id": "potencia-activa-p",
    "letter": "W",
    "term": "Wirkleistung (P)",
    "definition": "Komponente der elektrischen Leistung, die Nutzarbeit verrichtet – Wärme, Bewegung, Licht –, gemessen in Watt (W). Ihre Bilanz zwischen Erzeugung und Verbrauch bestimmt die Netzfrequenz: Ein Überschuss an aktiver Erzeugung führt zu einem Frequenzanstieg, ein Defizit zu einem Abfall. Im Gegensatz zur Blindleistung kann sie effizient über große Entfernungen übertragen werden. Der 28. April war unter anderem bemerkenswert für das, was er nicht war: kein Wirkleistungszusammenbruch. Zum Zeitpunkt des Zusammenbruchs deckte die aktive Erzeugung den festländischen Bedarf reichlich. Der Mechanismus des Vorfalls spielte sich vollständig in der Blindleistungsdimension ab; das Wirkleistungsungleichgewicht war eine Folge des Spannungszusammenbruchs, nicht seine Ursache. Diese Umkehrung der üblichen Kausalität – die Schutzsysteme waren für aktive Defizite ausgelegt, nicht für reaktive Überschüsse – machte das Ereignis so schwer vorhersehbar und so schnell in seiner Entwicklung."
  },
  {
    "id": "tap-lag",
    "letter": "T",
    "term": "Tap-Lag",
    "definition": "Phänomen, bei dem die mechanische Trägheit von Stufenschaltern (OLTC) eine Verzögerung von mehreren zehn Sekunden bei der Anpassung des Übersetzungsverhältnisses an eine plötzliche Spannungsänderung einführt, wodurch eine zeitliche Entkopplung zwischen der Primärspannung – im SCADA sichtbar – und der tatsächlichen Sekundärspannung entsteht. Am 28. April hatten die OLTCs ihre Stufen schrittweise erhöht, um vorherige Spannungseinbrüche zu kompensieren; als die durch die Vermaschung verursachte Überspannung eintraf, verhinderte die mechanische Verzögerung, dass dieselben OLTCs rechtzeitig herunterschalteten. Das Ergebnis war eine tatsächliche Überspannung von etwa 244 kV in den 220-kV-Sammelnetzen, während das SCADA von REE 418 kV auf der 400-kV-Primärseite anzeigte – innerhalb des Betriebsbereichs –, was einen toten Winkel der Beobachtbarkeit schuf, der das Situationsbewusstsein des Operators vor dem bevorstehenden Zusammenbruch verzögerte: Die ANSI-59-Schutzfunktionen der Wechselrichter sprachen auf eine Überspannung an, die physikalisch real, aber instrumentell unsichtbar war."
  },
  {
    "id": "phase-locked-loop-pll",
    "letter": "P",
    "term": "Phase-Locked Loop (PLL)",
    "definition": "Elektronischer Regelalgorithmus, der kontinuierlich die Frequenz und den Phasenwinkel der Spannung am Netzanschlusspunkt des Wechselrichters schätzt und den Ausgang des Geräts mit dieser Referenz synchronisiert, wodurch der GFL-Wechselrichter Strom phasengleich mit der Netzspannung einspeisen kann. Es ist der grundlegende Synchronisationsmechanismus aller GFL-Wechselrichter und bestimmt ihr Verhalten bei Spannungsstörungen: In Netzen mit SCR < 2 zeigt der PLL eine eigene Instabilität mit negativer Dämpfung (ζ_PLL < 0), was dazu führen kann, dass der Wechselrichter die Synchronisation verliert und auslöst. Am 28. April war der nahezu gleichzeitige Referenzverlust Tausender PLLs bei der Spannungsschwingung der Übertragungsmechanismus zwischen der anfänglichen Störung und der Kaskade von Abschaltungen: Jeder ausgefallene PLL verwandelte seinen Wechselrichter von einer potenziellen Stabilisierungsressource in eine abgeschaltete Einheit, was die Störung verschlimmerte, die der nächste PLL bewältigen musste."
  },
  {
    "id": "scada-supervisory-control-and-data-acquisition",
    "letter": "S",
    "term": "SCADA (Supervisory Control and Data Acquisition)",
    "definition": "Echtzeit-Überwachungs- und Steuerungssystem, das die Messungen der im Übertragungsnetz verteilten Sensoren – Spannungen, Ströme, Schalterstellungen, Leitungs- und Transformatorleistungen – in einer einheitlichen Darstellung des Systemzustands integriert und dem Operator die Überwachung und Steuerung des Netzes von den Leitwarten aus ermöglicht. Die zeitliche Auflösung konventioneller SCADA-Systeme – Aktualisierungen alle 2–10 Sekunden – ist für den Normalbetrieb ausreichend, aber ungeeignet, um Transienten zu verfolgen, die sich in Zehntelsekunden entwickeln. Am 28. April zeigte das SCADA von REE Spannungen im 400-kV-Netz innerhalb der Betriebsgrenzen (418 kV am Knoten Granada), während der Tap-Lag tatsächliche Überspannungen von etwa 244 kV auf der 220-kV-Sekundärseite erzeugte, die kaskadenartig die ANSI-59-Funktionen der Wechselrichter auslösten: Die Kaskade war für den Operator über das einzige in Echtzeit verfügbare Beobachtbarkeitssystem vollständig unsichtbar."
  },
  {
    "id": "wams-wide-area-monitoring-systems",
    "letter": "W",
    "term": "WAMS (Wide Area Monitoring Systems)",
    "definition": "Weitbereichs-Überwachungssystem, das Daten mehrerer GPS-synchronisierter Phasormesseinheiten (PMU) integriert, um ein dynamisches Bild des Netzzustands in kontinentalen geografischen Maßstäben mit einer zeitlichen Auflösung von 10–50 Millisekunden im Vergleich zu 2–10 Sekunden bei konventionellem SCADA zu liefern. Diese Auflösung ermöglicht die Beobachtung der Entwicklung von Interarea-Oszillationsmoden, die Erkennung früher Anzeichen dynamischer Instabilität und die Identifizierung des Ursprungs und der Ausbreitung von Störungen, bevor sie kritische Größenordnungen erreichen. Am 28. April stellten die WAMS-Daten von ENTSO-E – zusammen mit den Aufzeichnungen der Oszillografen der Schutzrelais – die wichtigste hochauflösende zeitliche Quelle für die forensische Rekonstruktion des Ereignisses dar und ermöglichten die Datierung der Sequenz von Auslösungen, die die Kaskade bildeten, mit einer Genauigkeit von Hundertstelsekunden."
  },
  {
    "id": "pmu-phasor-measurement-unit",
    "letter": "P",
    "term": "PMU (Phasor Measurement Unit)",
    "definition": "Phasormesseinheit: Gerät, das synchronisiert die Amplitude und den Phasenwinkel von Spannungen und Strömen an mehreren Netzpunkten mit einer zeitlichen Auflösung von 20–100 Abtastwerten pro Sekunde misst, wobei GPS-Signale verwendet werden, um die Synchronisation zwischen geografisch entfernten Einheiten zu gewährleisten. Die gleichzeitige Messung des Phasenwinkels an verschiedenen Knoten ermöglicht die Berechnung von Interarea-Winkeldifferenzen in Echtzeit und macht PMUs zum grundlegenden Werkzeug für die Früherkennung dynamischer Instabilitäten. Am 28. April wurde die Dichte der im festländischen Netz installierten PMUs – insbesondere unzureichend im 220-kV-Verteilnetz, wo der Tap-Lag entscheidend war – als eine der Beobachtbarkeitseinschränkungen genannt, die die Früherkennung des Zusammenbruchs erschwerten und die spätere forensische Rekonstruktionsfähigkeit beeinträchtigten."
  },
  {
    "id": "capacidad-neta-de-transferencia-ntc",
    "letter": "N",
    "term": "Netto-Übertragungskapazität (NTC)",
    "definition": "Maximale Austauschkapazität zwischen zwei Regelzonen, die ex ante zwischen den benachbaren ÜNB im Planungsprozess für den Folgetag vereinbart wird, unter Berücksichtigung der Betriebssicherheitsmargen und Netzrestriktionen an den Grenzpunkten. Die NTC ist die kommerzielle und operative Umsetzung der physischen Verbindung: Wenn die Verbindung existiert, aber die NTC gering ist, kann das System in Notfällen nicht von der Stärke des Nachbarsystems profitieren. Am 28. April lag die NTC der Verbindung Spanien-Frankreich bei etwa 3% der Nachfrage der Halbinsel – weit unter dem europäischen Ziel von 15% gemäß der Elektrizitätsverordnung 2019/943 –, was bedeutet, dass das gesamte kontinentale synchronisierte Netz in den kritischen Sekunden des Zusammenbruchs nicht ausreichend Unterstützung für die Halbinsel bereitstellen konnte, wodurch die Anfälligkeit für eine quasi-elektrische Isolation, unter der das iberische System strukturell leidet, verstärkt wurde."
  },
  {
    "id": "potencia-de-cortocircuito",
    "letter": "K",
    "term": "Kurzschlussleistung",
    "definition": "Ergänzend zu Eintrag 58: Die Kurzschlussleistung (S_sc) an einem Knoten ist ein direktes Maß für seine elektromagnetische Robustheit. Sie repräsentiert den Scheinstrom, der bei einem dreipoligen Kurzschluss in diesen Knoten fließen würde, und ist direkt proportional zur Dichte der synchronen Erzeugung und Kompensatoren in der Zone. Eine hohe S_sc bedeutet, dass die Spannung an diesem Knoten robust ist und bei Störungen und plötzlichen Lastzuschaltungen nur minimale Schwankungen aufweist; eine niedrige S_sc bedeutet, dass jede Änderung der Einspeisung zu einer verstärkten Spannungsänderung führt. Im Zusammenhang mit der Wechselrichteranalyse ermöglicht die Darstellung der Fehlerströme in p.u., die grundlegende Asymmetrie aufzuzeigen, die am 28. April zu einem systemischen Problem wurde: IBR-Wechselrichter speisen bei Fehlern 1,1–1,2 p.u. ein, während synchrone Generatoren 5–7 p.u. einspeisen, unabhängig von der Nennleistung der jeweiligen Technologie."
  },
  {
    "id": "estrategia-brownfield",
    "letter": "B",
    "term": "Brownfield-Strategie",
    "definition": "In der Energieinfrastrukturtechnik die Umrüstung bestehender Industrieanlagen – stillgelegte Kohlekraftwerke, Kernkraftwerke im Stilllegungsprozess, große außer Betrieb genommene Umspannwerke –, um ihnen neue systemische Funktionen zu verleihen, ohne neue Infrastruktur von Grund auf zu bauen. Im Kontext nach dem 28. April besteht die relevanteste Anwendung darin, die großen Generatoren dieser Anlagen zu erhalten – durch Abkopplung des Rotors von der Primärturbine – und sie als reine Synchronkompensatoren zu betreiben, unter Nutzung der bereits vorhandenen Umspannwerke, Transformatoren und Ableitungen. Die Vorteile sind quantifizierbar: Die Implementierungszeit verkürzt sich von 4–6 Jahren bei einer konventionellen Anlage auf 18–24 Monate, und die Kapitalkosten können 40–60% niedriger sein. Da die größten Defizite an Trägheit und Kurzschlussleistung, die am 28. April identifiziert wurden, genau in den Gebieten konzentriert sind, in denen die Kraftwerke stillgelegt wurden, bietet die Brownfield-Strategie den zusätzlichen Vorteil, die wesentlichen Dienstleistungen genau dort bereitzustellen, wo die forensische Analyse des Zusammenbruchs gezeigt hat, dass sie am dringendsten benötigt werden."
  },
  {
    "id": "sistema-por-unidad-p-u",
    "letter": "P",
    "term": "Per-Unit-System (p.u.)",
    "definition": "Normierungskonvention in der elektrischen Energietechnik, die Systemgrößen – Spannung, Strom, Leistung, Impedanz – als dimensionslose Verhältnisse zu Referenzbasiswerten ausdrückt: Die Spannungsbasis wird als Nennwert des Netzes am Analysepunkt genommen; die Leistungsbasis als Nennscheinleistung des Geräts oder Systems. Ihr grundlegender Vorteil ist die Eliminierung von Skalentransformationen bei der Analyse von Netzen mit mehreren Spannungsebenen, die durch Transformatoren verbunden sind, sodass eine Impedanz von 1 p.u. in einem 400-kV-Netz und in einem 20-kV-Netz die gleiche relative physikalische Bedeutung haben. Im Zusammenhang mit der Wechselrichteranalyse ermöglicht die Darstellung der Fehlerströme in p.u. einen direkten Vergleich der Einspeisefähigkeit von IBR-Wechselrichtern (1,1–1,2 p.u.) mit der von Synchrongeneratoren (5–7 p.u.), unabhängig von der Nennleistung der jeweiligen Technologie, und zeigt in einer einzigen Zahl die grundlegende Asymmetrie auf, die am 28. April zu einem systemischen Problem wurde."
  },
  {
    "id": "gfl-vs-gfm-grid-following-vs-grid-forming",
    "letter": "G",
    "term": "GFL vs. GFM (Grid-Following vs. Grid-Forming)",
    "definition": "Die Modi GFL und GFM definieren gegensätzliche elektrische Modelle des Wechselrichters. GFL (gesteuerte Stromquelle mit PLL) ist netzabhängig: Es benötigt eine andere Quelle, um Spannung und Frequenz zu etablieren, um betrieben werden zu können; wenn diese Referenz instabil wird, versagt der PLL und der Wechselrichter schaltet ab. GFM (ideale Spannungsquelle hinter einer virtuellen Reaktanz) ist autonom: Es stellt die Spannungs- und Frequenzreferenz bereit, anstatt ihr zu folgen, kann im Inselbetrieb arbeiten und liefert synthetische Trägheit und virtuelle Kurzschlussleistung. Der Übergang von GFL zu GFM ist nicht nur eine Firmware-Änderung, sondern ein Paradigmenwechsel in der Systemarchitektur: Bei GFL-Dominanz benötigt jeder Wechselrichter ein gesundes Netz, um zu arbeiten; bei GFM-Dominanz trägt jeder Wechselrichter aktiv zur Gesunderhaltung des Netzes bei. Der 28. April war der empirische Beweis, dass ein von GFL dominiertes System inhärent anfällig für Spannungsstörungen ist; der NC RfG 2.0 von ENTSO-E ist die regulatorische Antwort auf diesen Beweis."
  },
  {
    "id": "headroom",
    "letter": "H",
    "term": "Headroom",
    "definition": "Anteil der maximalen Scheinleistung, den ein GFM-Wechselrichter bewusst nicht für die Wirkleistungseinspeisung im Dauerbetrieb nutzen muss, um sicherzustellen, dass der Wechselrichter ausreichend Spielraum hat, um bei schnellen Spannungs- oder Frequenzstörungen zu reagieren, ohne die Leistungselektronik zu sättigen. Diese Reserve stellt den physischen Preis der dynamischen Stabilität dar: Ein Wechselrichter, der zu 100% seiner Wirkleistungskapazität betrieben wird, kann bei einer Störung keine zusätzliche Blindleistung einspeisen, ohne seine Stromgrenzen zu verletzen. Der wirtschaftliche Konflikt ist strukturell – Headroom ist nicht auf dem Markt verkaufte Wirkleistung – und rechtfertigt die Schaffung von Märkten für ERS, um ihn explizit zu vergüten: Ohne dieses Preissignal hat kein Betreiber einen Anreiz, die Reserve vorzuhalten, die das System nachweislich am 28. April benötigt."
  },
  {
    "id": "hvrt-high-voltage-ride-through",
    "letter": "H",
    "term": "HVRT (High Voltage Ride Through)",
    "definition": "Anforderung an IBR-Wechselrichter, bei Überspannungen im Netz (≥ 1,10 p.u.) verbunden zu bleiben und induktive Blindleistung aufzunehmen, als symmetrische Ergänzung zum LVRT. Während LVRT das Netz bei Spannungseinbrüchen schützt, schützt HVRT es bei Überspannungen, indem der Wechselrichter nicht abschaltet, sondern überschüssige kapazitive Blindleistung aufnimmt. Der 28. April zeigte seine kritische Bedeutung mit forensischer Präzision: Die Photovoltaik-Wechselrichter, die im Zeitfenster 12:32:57–12:33:18 CEST auslösten, taten dies, weil die Überspannung in ihren 220-kV-Sammelschienen – verstärkt durch den Tap-Lag und im 400-kV-SCADA von REE unsichtbar – ihre ANSI-59-Schwellen überschritt, in Ermangelung einer robusten HVRT-Anforderung, die mit der Übertragungsebene koordiniert war. Das Ergebnis war eine positive Rückkopplungsschleife: Jeder Wechselrichter, der aufgrund unzureichender HVRT auslöste, reduzierte die Blindleistungsaufnahme weiter, erhöhte die Spannung weiter und aktivierte die ANSI-59-Schwelle des nächsten Wechselrichters."
  },
  {
    "id": "mrscr-multiple-renewable-short-circuit-ratio",
    "letter": "M",
    "term": "MRSCR (Multiple Renewable Short-Circuit Ratio)",
    "definition": "Erweiterung des klassischen SCR, die die elektrischen Wechselwirkungen zwischen mehreren nahegelegenen IBR-Anlagen erfasst: Wenn zwei Wechselrichter an dasselbe elektrische Gebiet angeschlossen sind, verschlechtert der Betrieb des einen das effektive SCR des anderen – sie teilen sich dieselbe lokale Kurzschlussleistung –, sodass das individuelle SCR jeder Anlage die tatsächlich verfügbare Netzfestigkeit überschätzt. Es wird berechnet als MRSCR_i = S_ac,i / (P_i + Σ MIIF_ji · P_j), wobei MIIF_ji der Interaktionsfaktor zwischen den Anlagen ist. Der kritische Wert in den neuen Netzcodes ist 1,5; ein MRSCR < 1,5 berechtigt den ÜNB, neue Anschlüsse zu blockieren, bis im Gebiet Synchronkompensatoren installiert sind. Am 28. April führte die hohe Konzentration von IBR-Anlagen im Süden der Halbinsel dazu, dass die individuellen SCR – scheinbar akzeptabel – tatsächliche MRSCR unterhalb des kritischen Schwellenwerts verbargen, ein Zustand, der in den Anschlussstudien des Zeitraums 2020–2025 nicht erfasst wurde, da der MRSCR nicht Teil der damals geltenden regulatorischen Anforderungen war."
  },
  {
    "id": "miif-multi-infeed-interaction-factor",
    "letter": "M",
    "term": "MIIF (Multi-Infeed Interaction Factor)",
    "definition": "Dimensionsloser Faktor, der den Einfluss der von einer IBR-Anlage j eingespeisten Leistung auf die effektive Netzfestigkeit am Knoten einer anderen IBR-Anlage i quantifiziert und den Grad der elektrischen Kopplung zwischen beiden erfasst. Ein MIIF nahe 1 zeigt eine starke Kopplung an – die beiden Anlagen teilen sich fast dieselbe lokale Kurzschlussleistung –; nahe 0 eine substanzielle elektrische Unabhängigkeit. Er wird bei der Berechnung des MRSCR verwendet, um die Verschlechterung des effektiven SCR zu quantifizieren, wenn mehrere Wechselrichter im selben Gebiet konzentriert sind. Der NC RfG 2.0 verlangt, dass Betreiber neuer IBR-Anlagen den MIIF mit allen Anlagen in einem Umkreis von 200 km berechnen, bevor sie die Anschlussgenehmigung erhalten, eine Anforderung, die direkt durch den 28. April motiviert ist: Die Post-Incident-Analyse zeigte, dass die Solarkonzentration im Süden der Halbinsel MIIF nahe 1 zwischen Anlagen in Dutzenden Kilometern Entfernung erzeugte, wodurch das effektive SCR des gesamten Gebiets so verschlechtert wurde, dass keine individuelle Anschlussstudie dies erfassen konnte."
  },
  {
    "id": "ansi-59-proteccion-de-sobretension",
    "letter": "A",
    "term": "ANSI 59 (Überspannungsschutz)",
    "definition": "Standard-Schutzfunktion (IEEE/ANSI 59), die erkennt, wenn die Spannung an den Klemmen eines Geräts einen voreingestellten Schwellenwert überschreitet, und dessen Abschaltung anordnet, um Isolationsverschlechterung und Schäden an der Leistungselektronik zu verhindern. Bei IBR-Wechselrichtern ist sie typischerweise so kalibriert, dass sie auslöst, wenn die Spannung auf der Sekundärseite des Aufwärtstransformators ~1,10–1,15 p.u. überschreitet. Am 28. April erzeugte der Tap-Lag eine kritische Diskrepanz zwischen der im SCADA von REE sichtbaren Spannung (400-kV-Primärseite, innerhalb der Grenzen) und der tatsächlichen Spannung in den 220-kV-Sammelschienen (Sekundärseite, mit Überspannung ≥ 1,10 p.u. aufgrund der nicht rechtzeitig heruntergestellten Stufenschalter). Die ANSI-59-Funktion tausender Wechselrichter reagierte auf eine Überspannung, die physikalisch real, aber für den Systembetreiber instrumentell unsichtbar war, und löste die Kaskade von Abschaltungen aus, die innerhalb von 30 Sekunden im vollständigen Blackout gipfelte."
  },
  {
    "id": "ansi-78-proteccion-de-perdida-de-sincronismo",
    "letter": "A",
    "term": "ANSI 78 (Pendelschutz)",
    "definition": "Schutzfunktion (IEEE/ANSI 78), die den Synchronismusverlust zwischen zwei elektrischen Systemen durch Verfolgung des Scheinimpedanzzeigers in der R-X-Ebene erkennt: Wenn der Zeiger die Mho-Kennlinie mit der für ein Polradpendeln typischen Geschwindigkeit und Richtung kreuzt, ordnet die Funktion die Öffnung des Leistungsschalters an, um die beiden Systeme zu trennen, bevor die Winkeldivergenz mechanische Schäden an Generatoren oder schwere Störungen im Netz verursacht. Um 12:33:21 CEST am 28. April 2025 lösten die ANSI-78-Schutzfunktionen der beiden 400-kV-Verbindungen über die Pyrenäen – Hernani und Vic-Baixas – aus, als sie den Synchronismusverlust zwischen der Iberischen Halbinsel und dem kontinentaleuropäischen System erkannten, und bestätigten damit, dass sich das iberische System in einer irreversiblen Winkeldifferenz befand. Es war der genaue Moment, in dem ein schwerwiegender Vorfall formell zu einem Blackout wurde."
  },
  {
    "id": "magnetizing-inrush",
    "letter": "M",
    "term": "Magnetisierungsstoßstrom",
    "definition": "Transienter Strom hoher Amplitude – zwischen dem 6- und 10-fachen des Nennstroms –, den der ferromagnetische Kern eines Transformators im Moment seiner Einschaltung aufnimmt, während der magnetische Fluss von Null auf den stationären Wert aufgebaut wird. Er hat eine starke Komponente der zweiten Oberschwingung, eine Eigenschaft, die Differentialschutzrelais nutzen, um ihn von einem echten internen Fehler zu unterscheiden. In Netzen mit geringer Kurzschlussleistung kann der Referenzgenerator möglicherweise nicht den erforderlichen Blindleistungsstoß liefern, ohne dass die Spannung lokal zusammenbricht. Am 28. April wurde das Phänomen während der Wiedereinschaltvorgänge am Transformator T4 des Umspannwerks Zêzere (Portugal) dokumentiert und stellte eines der Ereignisse dar, die die schrittweise Wiederherstellung des Systems verzögerten, und zeigte, dass Wiedereinschaltmanöver in Netzen mit niedriger Trägheit und niedrigem SCR ein speziell für die Handhabung von Einschalttransienten entwickeltes Protokoll erfordern."
  },
  {
    "id": "sympathetic-inrush",
    "letter": "S",
    "term": "Sympathischer Stoßstrom",
    "definition": "Phänomen, das auftritt, wenn die Einschaltung eines Transformators durch magnetische Wechselwirkung über die gemeinsame Sammelschiene die Wiedererregung eines benachbarten, bereits in Betrieb befindlichen Transformators verursacht: Die Gleichstromkomponente des Flusses des neu zugeschalteten Transformators induziert eine teilweise Sättigung im Kern des benachbarten Transformators und erzeugt einen sekundären Einschaltstrom in einer Einheit, die nicht geschaltet wurde. Er teilt mit dem Magnetisierungsstoßstrom die dominante Komponente der zweiten Oberschwingung, was die Differentialschutzrelais des in Betrieb befindlichen Transformators aktivieren und während Wiedereinschaltmanövern zu dessen unbeabsichtigter Auslösung führen kann. Die diagnostische Unterscheidung zwischen beiden Phänomenen ist während der Wiederherstellung nach einem Blackout betrieblich kritisch: Ein Differentialrelais, das aufgrund eines sympathischen Stoßstroms auslöst, kann fälschlicherweise als echter Fehler interpretiert werden, was die Wiedereinschaltung verzögert und eine ohnehin bereits an den Grenzen ihrer Auslegungsannahmen arbeitende Wiederherstellungssequenz erschwert."
  },
  {
    "id": "voll-value-of-lost-load",
    "letter": "V",
    "term": "VoLL (Value of Lost Load)",
    "definition": "Marginale wirtschaftliche Kosten, die Verbraucher zu zahlen bereit sind, um eine zusätzliche Einheit ungeplanter Unterbrechung der Versorgung zu vermeiden, ausgedrückt in €/MWh; es ist kein Tarif, sondern eine Schätzung offenbarter Präferenzen mittels kontingenter Bewertungsmethoden. Für Spanien liegen die regulatorischen Studien zwischen 8.000 und 12.000 €/MWh für Haushalte und zwischen 15.000 und 50.000 €/MWh für die Industrie mit kontinuierlichen Prozessen. Angewandt auf den 28. April – ~25,2 GW unterbrochene Leistung über durchschnittlich 8 Stunden, mit bemerkenswerten Unterschieden nach Gebieten und Sektoren – rechtfertigt das aggregierte VoLL die von CEOE und ATA geschätzte Bandbreite von 1.000–1.500 Mio. € direkter wirtschaftlicher Schäden, ohne Berücksichtigung indirekter Verluste durch Unterbrechung von Lieferketten, Geräteschäden oder Kosten der Wiederherstellungsmaßnahmen. Das VoLL ist letztlich die Kennzahl, die die technische Debatte über ERS-Märkte in ein wirtschaftliches Argument ohne Ambiguitäten verwandelt: Wenn die Vermeidung des nächsten 28. April regulatorische Kosten von X Mio. €/Jahr verursacht und das VoLL des Vorfalls 1.000–1.500 Mio. € betrug, wird die Kosten-Nutzen-Logik der Präventionsausgaben aus jeder Perspektive schwer zu widerlegen."
  }
];
