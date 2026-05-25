/**
 * LateralBar.jsx
 * Componente completo de barra lateral para documental 28-A
 * 
 * USO:
 * import LateralBar from '@/components/LateralBar';
 * <LateralBar activePage="colapso-frecuencia" onPageChange={(page) => navigate(page)} />
 */

import { useState } from 'react';
import { Category, CategoryItem, NavItem, CategorySpacer } from './SidebarCategory';
import {
  IconZap,
  IconBarChart2,
  IconGamepad2,
  IconCompass,
  IconGlobe,
  IconBook,
  IconTrendingUp,
  IconTool,
} from './SidebarIcons';
import './sidebar.css';

export default function LateralBar({ 
  activePage = 'colapso-frecuencia', 
  onPageChange = () => {} 
}) {
  const [expandedCategories, setExpandedCategories] = useState({
    analisis: true,
    tecnico: true,
    experimental: true,
    futuro: false,
    metodos: false,
    europa: false,
    referencias: false,
    visualizaciones: false,
  });

  const toggleCategory = (key) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
  };

  return (
    <div className="lateral-bar scanlines">
      {/* HEADER */}
      <div className="sidebar-header">
        <p className="sidebar-title">28-A · INCIDENTE ELÉCTRICO</p>
      </div>

      {/* NAV */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {/* ===== ITEMS SUELTOS ===== */}

          <NavItem
            label="Introducción"
            isActive={activePage === 'introduccion'}
            onClick={() => handlePageChange('introduccion')}
          />

          <NavItem
            label="Contexto Técnico"
            isActive={activePage === 'contexto'}
            onClick={() => handlePageChange('contexto')}
          />

          <CategorySpacer />

          {/* ===== ANÁLISIS DEL INCIDENTE ===== */}

          <Category
            title="⚡ Análisis del Incidente"
            icon={IconZap}
            isOpen={expandedCategories.analisis}
            onToggle={() => toggleCategory('analisis')}
          >
            <CategoryItem
              label="Análisis del Incidente"
              isActive={activePage === 'analisis-incidente'}
              onClick={() => handlePageChange('analisis-incidente')}
            />
            <CategoryItem
              label="Reacción y Reposición"
              isActive={activePage === 'reaccion'}
              onClick={() => handlePageChange('reaccion')}
            />
            <CategoryItem
              label="Impacto Comunicativo"
              isActive={activePage === 'impacto'}
              onClick={() => handlePageChange('impacto')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== ANÁLISIS TÉCNICO ===== */}

          <Category
            title="📊 Análisis Técnico"
            icon={IconBarChart2}
            isOpen={expandedCategories.tecnico}
            onToggle={() => toggleCategory('tecnico')}
          >
            <CategoryItem
              label="Análisis de los Informes Oficiales"
              isActive={activePage === 'informes'}
              onClick={() => handlePageChange('informes')}
            />
            <CategoryItem
              label="Colapso de Frecuencia"
              isActive={activePage === 'colapso-frecuencia'}
              onClick={() => handlePageChange('colapso-frecuencia')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== EXPERIMENTACIÓN INTERACTIVA (CON ALERTA ROJA) ===== */}

          <Category
            title="🎮 Experimentación Interactiva"
            icon={IconGamepad2}
            isOpen={expandedCategories.experimental}
            onToggle={() => toggleCategory('experimental')}
            isExperimental={true}
          >
            <CategoryItem
              label="Simulador: Ecuación del Swing"
              isActive={activePage === 'swing'}
              onClick={() => handlePageChange('swing')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== FUTURO Y RESILIENCIA ===== */}

          <Category
            title="🔮 Futuro y Resiliencia"
            icon={IconCompass}
            isOpen={expandedCategories.futuro}
            onToggle={() => toggleCategory('futuro')}
          >
            <CategoryItem
              label="Resiliencia y Futuro"
              isActive={activePage === 'resiliencia'}
              onClick={() => handlePageChange('resiliencia')}
            />
            <CategoryItem
              label="Consecuencias Financieras"
              isActive={activePage === 'financiero'}
              onClick={() => handlePageChange('financiero')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== MÉTODOS Y ACTUALIZACIONES ===== */}

          <Category
            title="🛠️ Métodos y Actualizaciones"
            icon={IconTool}
            isOpen={expandedCategories.metodos}
            onToggle={() => toggleCategory('metodos')}
          >
            <CategoryItem
              label="Uso de Inteligencia Artificial"
              isActive={activePage === 'ia'}
              onClick={() => handlePageChange('ia')}
            />
            <CategoryItem
              label="Actualización 2026"
              isActive={activePage === 'actualizacion'}
              onClick={() => handlePageChange('actualizacion')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== CONCLUSIONES ===== */}

          <NavItem
            label="Conclusiones"
            isActive={activePage === 'conclusiones'}
            onClick={() => handlePageChange('conclusiones')}
          />

          <CategorySpacer large={true} />

          {/* ===== DIMENSIÓN EUROPEA ===== */}

          <Category
            title="🌍 Dimensión Europea"
            icon={IconGlobe}
            isOpen={expandedCategories.europa}
            onToggle={() => toggleCategory('europa')}
          >
            <CategoryItem
              label="Francia y Portugal"
              isActive={activePage === 'europa-paises'}
              onClick={() => handlePageChange('europa-paises')}
            />
            <CategoryItem
              label="Coordinación Continental"
              isActive={activePage === 'coordinacion'}
              onClick={() => handlePageChange('coordinacion')}
            />
            <CategoryItem
              label="El Día Después"
              isActive={activePage === 'dia-despues'}
              onClick={() => handlePageChange('dia-despues')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== REFERENCIA ===== */}

          <Category
            title="📚 Referencia"
            icon={IconBook}
            isOpen={expandedCategories.referencias}
            onToggle={() => toggleCategory('referencias')}
          >
            <CategoryItem
              label="Glosario Técnico"
              isActive={activePage === 'glosario'}
              onClick={() => handlePageChange('glosario')}
            />
            <CategoryItem
              label="Referencias y Bibliografía"
              isActive={activePage === 'bibliografia'}
              onClick={() => handlePageChange('bibliografia')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== VISUALIZACIONES ===== */}

          <Category
            title="📈 Visualizaciones"
            icon={IconTrendingUp}
            isOpen={expandedCategories.visualizaciones}
            onToggle={() => toggleCategory('visualizaciones')}
          >
            <CategoryItem
              label="Cronograma del Incidente"
              isActive={activePage === 'cronograma'}
              onClick={() => handlePageChange('cronograma')}
            />
            <CategoryItem
              label="Galería de Gráficas"
              isActive={activePage === 'graficas'}
              onClick={() => handlePageChange('graficas')}
            />
            <CategoryItem
              label="Galería de Imágenes"
              isActive={activePage === 'imagenes'}
              onClick={() => handlePageChange('imagenes')}
            />
          </Category>

          <CategorySpacer />

          {/* ===== ITEMS FINALES ===== */}

          <NavItem
            label="Descargas y Documentación"
            isActive={activePage === 'descargas'}
            onClick={() => handlePageChange('descargas')}
          />

          <NavItem
            label="Sobre el Autor"
            isActive={activePage === 'autor'}
            onClick={() => handlePageChange('autor')}
          />

          {/* Espacio final */}
          <div style={{ height: '40px' }}></div>
        </ul>
      </nav>
    </div>
  );
}
