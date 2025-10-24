-- Datos para poblar la tabla de versículos bíblicos
-- Insertar versículos categorizados por emociones y temas

INSERT INTO wellness_content (title, content, category, tags) VALUES 
-- Categoría: Ansiedad y Preocupación
('Filipenses 4:6-7', 'Por nada estén afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.', 'prayer', ARRAY['ansiedad', 'paz', 'oración', 'preocupación']),

('Mateo 6:26', 'Mirad las aves del cielo, que no siembran, ni siegan, ni recogen en graneros; y vuestro Padre celestial las alimenta. ¿No valéis vosotros mucho más que ellas?', 'mindfulness', ARRAY['ansiedad', 'confianza', 'provisión', 'valor']),

('1 Pedro 5:7', 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.', 'prayer', ARRAY['ansiedad', 'cuidado', 'entrega', 'confianza']),

-- Categoría: Depresión y Tristeza
('Salmos 34:18', 'Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.', 'prayer', ARRAY['tristeza', 'consuelo', 'cercanía', 'salvación']),

('Isaías 41:10', 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.', 'prayer', ARRAY['miedo', 'fortaleza', 'ayuda', 'sostén']),

('Salmos 30:5', 'Porque un momento será su ira, pero su favor dura toda la vida. Por la noche durará el lloro, y a la mañana vendrá la alegría.', 'meditation', ARRAY['tristeza', 'esperanza', 'alegría', 'renovación']),

-- Categoría: Soledad
('Deuteronomio 31:6', 'Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos, porque Jehová tu Dios es el que va contigo; no te dejará, ni te desamparará.', 'prayer', ARRAY['soledad', 'acompañamiento', 'valor', 'presencia']),

('Salmos 23:4', 'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.', 'meditation', ARRAY['soledad', 'protección', 'acompañamiento', 'seguridad']),

('Hebreos 13:5', 'Sean vuestras costumbres sin avaricia, contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.', 'mindfulness', ARRAY['soledad', 'contentamiento', 'fidelidad', 'presencia']),

-- Categoría: Estrés y Agotamiento
('Mateo 11:28-30', 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. Llevad mi yugo sobre vosotros, y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas. Porque mi yugo es fácil, y ligera mi carga.', 'meditation', ARRAY['estrés', 'descanso', 'alivio', 'suavidad']),

('Salmos 46:10', 'Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones; enaltecido seré en la tierra.', 'meditation', ARRAY['estrés', 'quietud', 'conocimiento', 'paz']),

('Isaías 40:31', 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.', 'mindfulness', ARRAY['agotamiento', 'renovación', 'esperanza', 'fortaleza']),

-- Categoría: Falta de Esperanza
('Jeremías 29:11', 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.', 'prayer', ARRAY['esperanza', 'futuro', 'planes', 'paz']),

('Romanos 8:28', 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.', 'meditation', ARRAY['esperanza', 'propósito', 'bien', 'amor']),

('Apocalipsis 21:4', 'Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto, ni clamor, ni dolor; porque las primeras cosas pasaron.', 'prayer', ARRAY['esperanza', 'consolación', 'renovación', 'futuro']),

-- Categoría: Perdón y Culpa
('1 Juan 1:9', 'Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.', 'prayer', ARRAY['perdón', 'confesión', 'limpieza', 'fidelidad']),

('Salmos 103:12', 'Cuanto está lejos el oriente del occidente, hizo alejar de nosotros nuestras rebeliones.', 'meditation', ARRAY['perdón', 'olvido', 'distancia', 'limpieza']),

('Romanos 8:1', 'Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús, los que no andan conforme a la carne, sino conforme al Espíritu.', 'meditation', ARRAY['culpa', 'libertad', 'nueva vida', 'espíritu']),

-- Categoría: Autoestima y Valor Personal
('Salmos 139:14', 'Te alabaré; porque formidables, maravillosas son tus obras; estoy maravillado, y mi alma lo sabe muy bien.', 'mindfulness', ARRAY['autoestima', 'creación', 'maravilla', 'valor']),

('Efesios 2:10', 'Porque somos hechura suya, creados en Cristo Jesús para buenas obras, las cuales Dios preparó de antemano para que anduviésemos en ellas.', 'meditation', ARRAY['propósito', 'creación', 'obras', 'identidad']),

('1 Pedro 2:9', 'Mas vosotros sois linaje escogido, real sacerdocio, nación santa, pueblo adquirido por Dios, para que anunciéis las virtudes de aquel que os llamó de las tinieblas a su luz admirable.', 'prayer', ARRAY['identidad', 'valor', 'elección', 'luz']),

-- Categoría: Gratitud y Alegría
('Salmos 118:24', 'Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.', 'mindfulness', ARRAY['gratitud', 'alegría', 'presente', 'gozo']),

('1 Tesalonicenses 5:18', 'Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.', 'prayer', ARRAY['gratitud', 'voluntad', 'todo', 'agradecimiento']),

('Nehemías 8:10', 'Luego les dijo: Id, comed grosuras, y bebed vino dulce, y enviad porciones a los que no tienen nada preparado; porque día santo es a nuestro Señor; no os entristezcáis, porque el gozo de Jehová es vuestra fuerza.', 'mindfulness', ARRAY['gozo', 'fortaleza', 'celebración', 'compartir']),

-- Categoría: Sabiduría y Dirección
('Proverbios 3:5-6', 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.', 'prayer', ARRAY['confianza', 'dirección', 'sabiduría', 'caminos']),

('Santiago 1:5', 'Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada.', 'prayer', ARRAY['sabiduría', 'petición', 'abundancia', 'sin reproche']),

('Salmos 32:8', 'Te haré entender, y te enseñaré el camino en que debes andar; sobre ti fijaré mis ojos.', 'meditation', ARRAY['enseñanza', 'camino', 'dirección', 'cuidado']),

-- Categoría: Fortaleza en Dificultades
('2 Corintios 12:9', 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo.', 'prayer', ARRAY['gracia', 'poder', 'debilidad', 'fortaleza']),

('Romanos 8:37', 'Antes, en todas estas cosas somos más que vencedores por medio de aquel que nos amó.', 'meditation', ARRAY['victoria', 'amor', 'superación', 'triunfo']),

('Josué 1:9', 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.', 'prayer', ARRAY['valor', 'fortaleza', 'presencia', 'acompañamiento']);

-- Insertar recursos de emergencia mejorados
INSERT INTO emergency_resources (name, phone, description, category, location, is_active) VALUES 
('Línea Nacional de Prevención del Suicidio', '988', 'Apoyo de crisis 24/7 para personas en riesgo de suicidio', 'crisis', 'Estados Unidos', true),
('Crisis Text Line', '741741', 'Envía "HOME" para recibir apoyo por texto las 24 horas', 'crisis', 'Estados Unidos', true),
('SAMHSA National Helpline', '1-800-662-4357', 'Servicio de información y referencias para trastornos mentales y de uso de sustancias', 'salud_mental', 'Estados Unidos', true),
('National Domestic Violence Hotline', '1-800-799-7233', 'Apoyo confidencial 24/7 para víctimas de violencia doméstica', 'violencia', 'Estados Unidos', true),
('Teen Line', '1-800-852-8336', 'Línea de apoyo para adolescentes atendida por adolescentes', 'jovenes', 'Estados Unidos', true),
('National Child Abuse Hotline', '1-800-422-4453', 'Apoyo 24/7 para casos de abuso infantil', 'menores', 'Estados Unidos', true),
('LGBT National Hotline', '1-888-843-4564', 'Apoyo confidencial para la comunidad LGBT+', 'lgbt', 'Estados Unidos', true),
('Veterans Crisis Line', '1-800-273-8255', 'Apoyo especializado para veteranos militares', 'veteranos', 'Estados Unidos', true),
('Servicios de Emergencia', '911', 'Para situaciones de emergencia que requieren respuesta inmediata', 'emergencia', 'Estados Unidos', true),
('Teléfono de la Esperanza', '+34 717 003 717', 'Apoyo emocional y prevención del suicidio en España', 'crisis', 'España', true);

-- Nota: Esto debe ejecutarse después de las migraciones de autenticación