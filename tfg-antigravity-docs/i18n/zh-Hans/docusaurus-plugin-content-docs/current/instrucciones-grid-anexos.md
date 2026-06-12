# 精确指令 — 在全部10个附录中应用 AnnexEvidenceGrid

对于每个文件，使用 `str_replace`（不要用脚本）。完成所有更改后：`npm run build`。

---

## 通用规则

在任何尚未包含 `import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';` 的 MDX 文件头部添加该导入语句。
然后用 `<AnnexEvidenceGrid>` 包裹指定的连续图形对。

---

## 附录 I — 已有导入。在第3节和第4节添加网格。

### 第3节 — capacidad + chart-5 一起

精确查找：
```
    <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
    <AnnexEvidence type="chart" id="chart-5" level={3} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
      <AnnexEvidence type="chart" id="chart-5" level={3} />
    </AnnexEvidenceGrid>
```

### 第4节 — 两个过渡期上下文图形

精确查找：
```
    <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
    Durante la re-energización posterior al colapso, las fuentes IBR quedaron excluidas hasta verificar niveles mínimos de Scc e inercia, evidenciando que la reposición dependía inicialmente de generación síncrona e importaciones.
    <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
      <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
    </AnnexEvidenceGrid>
    <p>2010-2024年的对比显示了结构性转变。在重新供电期间，IBR电源被排除在外，直到验证了最低Scc和惯性水平。</p>
```

---

## 附录 II — `anexo-estabilidad-dinamica-tension.mdx`

如果尚未包含，添加导入：
```
import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';
```

### 第1节 — 两个前兆一起

精确查找：
```
    <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
    <p>La proximidad del punto operativo al nariz de la curva Q-V es la evidencia más directa de que el sistema estaba al borde del colapso de tensión.</p>
    <p>El 22 de abril de 2025 se registró un evento precursor de sobretensión en la misma zona del sur peninsular.</p>
    <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
      <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
    </AnnexEvidenceGrid>
    <p>Q-V曲线显示了电压崩溃的临近。4月22日的事件——崩溃前六天——证明了持续存在的脆弱性，而非孤立事件。</p>
```

### 第1节 — frequency_voltage_carmona 与 nunez_balboa 并列

精确查找：
```
    <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
```

如果其后跟随表格，然后是 AnnexEvidenceLead，则保持不变。
如果其后跟随 `frequency_voltage_carmona`，则将两者包裹在网格中：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
      <AnnexEvidence type="figure" id="frequency_voltage_carmona" level={1} />
    </AnnexEvidenceGrid>
```

### 第3节 — 无功平衡：两个图形

精确查找：
```
    <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
```
如果其后跟随 `mapas_termicos_tension_ree`，则将两者包裹：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
      <AnnexEvidence type="figure" id="mapas_termicos_tension_ree" level={3} />
    </AnnexEvidenceGrid>
```

---

## 附录 III — `anexo-cascada-protecciones-desconexiones.mdx`

如果尚未包含，添加导入。

### 阶段1 — tap_lag + aluvion 一起

精确查找：
```
    <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
    <p>Este mecanismo es un factor clave para entender por qué el operador no vio la sobretensión hasta que los inversores comenzaron a desconectarse.</p>
    <p>El aluvión de alertas de sobretensión registradas en la zona sur documenta la rapidez con que se expandió la perturbación por las líneas de 400 kV.</p>
    <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
      <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
    </AnnexEvidenceGrid>
    <p>Tap-Lag解耦放大了集电网络中的过电压，使其对REE的SCADA不可见。南部的警报洪流记录了扰动扩展的速度。</p>
```

### 阶段2 — cascada + albustami

注意：`cascada_desconexiones` 可能位于 `AnnexEvidenceLead` 内部。如果是这样，仅将网格应用于 `albustami_ieee39_secuencia` 及其下一个可用图形，如果没有逻辑配对则单独保留。

如果 `cascada_desconexiones` 不在 AnnexEvidenceLead 中，查找：
```
    <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
    <p>La velocidad de la propagación — 11 segundos — superó la capacidad de respuesta de los mecanismos automáticos de defensa.</p>
    <p>El estudio de estabilidad transitoria en la red equivalente IEEE 39 nudos muestra cómo las desconexiones sucesivas de generadores provocan oscilaciones dinámicas severas.</p>
    <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
      <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
    </AnnexEvidenceGrid>
    <p>11秒内的地理传播速度超过了自动防御机制的响应能力。IEEE 39节点研究显示了连续发电机脱网如何产生严重振荡。</p>
```

---

## 附录 IV — `anexo-interconexiones-flujos.mdx`

如果尚未包含，添加导入。

### 第1节 — interconexion_francia + perdida_sincronismo

如果两个图形连续出现（且 `interconexion_francia_colapso` 尚未在 AnnexEvidenceLead 中）：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
    </AnnexEvidenceGrid>
```

如果 `entsoe_flow_deviation` 在 AnnexEvidenceLead 中，且 `interconexion_francia_colapso` 单独出现在其后，则与 `perdida_sincronismo_frontera` 包裹：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
    </AnnexEvidenceGrid>
```

### 第4节 — evolucion_carga + timeline

查找：
```
    <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
```
如果其后跟随 `timeline-light`：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
      <AnnexEvidence type="figure" id="timeline-light" level={2} />
    </AnnexEvidenceGrid>
```

---

## 附录 V — `anexo-mercado-costes.mdx`

如果尚未包含，添加导入。

### 第3节 — coste_optimo_ers + ers_revenue_stacking

如果两者连续出现（且 `coste_optimo_ers` 不在 AnnexEvidenceLead 中）：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="coste_optimo_ers" level={3} />
      <AnnexEvidence type="figure" id="ers_revenue_stacking" level={3} />
    </AnnexEvidenceGrid>
```

如果 `coste_optimo_ers` 在 AnnexEvidenceLead 中，查找 `ers_revenue_stacking` 并在其前添加介绍文本。

---

## 附录 VI — `anexo-reposicion-blackstart.mdx`

如果尚未包含，添加导入。

### 第1节 — black_start + islas_reposicion

查找：
```
    <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
```
如果其后跟随 `islas_reposicion_entsoe`：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
      <AnnexEvidence type="figure" id="islas_reposicion_entsoe" level={2} />
    </AnnexEvidenceGrid>
```

---

## 附录 VII — `anexo-impacto-resiliencia.mdx`

如果尚未包含，添加导入。
没有连续的静态图形对。无需网格更改。

---

## 附录 VIII — `anexo-comunicacion-fuentes.mdx`

如果尚未包含，添加导入。

### 第1节 — conservador + progresista

查找：
```
    <AnnexEvidence type="figure" id="collage_conservador" level={2} />
    <AnnexEvidence type="figure" id="collage_progresista" level={2} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_conservador" level={2} />
      <AnnexEvidence type="figure" id="collage_progresista" level={2} />
    </AnnexEvidenceGrid>
```

### 第2节 — ciudadanos + politicos

查找：
```
    <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
    <AnnexEvidence type="figure" id="collage_politicos" level={2} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
      <AnnexEvidence type="figure" id="collage_politicos" level={2} />
    </AnnexEvidenceGrid>
```

---

## 附录 IX — `anexo-metodologia-modelos-datos-vivos.mdx`

如果尚未包含，添加导入。

### 第1节 — scr_iberia + po74_banda_muerta

查找：
```
    <AnnexEvidence type="figure" id="scr_iberia" level={2} />
    <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="scr_iberia" level={2} />
      <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
    </AnnexEvidenceGrid>
```

### 第2节 — gfl_vs_gfm + hitachi_hybrid

查找：
```
    <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
    <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
```

替换为：
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
      <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
    </AnnexEvidenceGrid>
```

---

## 附录 X — `anexo-ecuaciones-matematicas.mdx`

没有静态图形。无需网格更改。

---

## 最终验证

完成所有 str_replace 后，执行：

```bash
node -e "
const fs = require('fs');
const files = fs.readdirSync('docs').filter(f => f.startsWith('anexo-') && f.endsWith('.mdx'));
files.forEach(f => {
  const c = fs.readFileSync('docs/' + f, 'utf8');
  const grids = (c.match(/<AnnexEvidenceGrid>/g)||[]).length;
  const leads = (c.match(/AnnexEvidenceLead\s*\n?\s*eyebrow=/g)||[]).length;
  if (grids > 0 || leads > 0)
    console.log(f.replace('anexo-','').replace('.mdx','') + ' | grids: ' + grids + ' | leads: ' + leads);
});
"
```

然后 `npm run build`。