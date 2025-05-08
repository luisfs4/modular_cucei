// Interfaces para la respuesta de la API
export interface IANivelParametro {
  valor: number
  nivel: number // 0=bajo, 1=normal, 2=alto
  interpretacion: string // "bajo", "normal", "alto"
}

export interface IAResultado {
  resultado_general: string
  niveles: Record<string, IANivelParametro>
}

export interface IAProcessResult {
  success: boolean
  data?: any
  message?: string
}

const IA_API_URL = process.env.NEXT_PUBLIC_IA_API_URL || "http://localhost:3000/api/ia"

export interface IAAnalysisRequest {
  inputImagen: File
  tipo_estudio: string
}

export interface IAAnalysisResponse {
  success: boolean
  data: any
  message?: string
}

// Servicio de IA
export const iaService = {
  // Verificar si el servicio de IA está disponible
  async checkStatus(): Promise<boolean> {
    return true;
  },

  // Procesar imagen con la API de IA
  async processImage(data: { inputImagen: File; tipo_estudio: string }): Promise<IAProcessResult> {
    try {
      const capitalizado: string = data.tipo_estudio
                                  .split("_")
                                  .map((palabra: string) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                                  .join("_");

      const formData = new FormData()
      formData.append("inputImagen", data.inputImagen)
      formData.append("tipo_estudio", capitalizado)

      const response = await fetch(`${process.env.NEXT_PUBLIC_IA_API_URL || "/api"}/ia/input`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }

      const resultado = await response.json()
      return {
        success: true,
        data: this.formatearResultadoIA(resultado, data.tipo_estudio),
      }
    } catch (error) {
      console.error("Error al procesar imagen con IA:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al procesar la imagen",
      }
    }
  },

  // Formatear el resultado de la API de IA al formato esperado por la aplicación
  formatearResultadoIA(resultado: IAResultado, tipoEstudio: string): any {
    // Convertir el formato de la API al formato esperado por la aplicación
    const parametrosFormateados: Record<string, any> = {}

    // Mapeo de unidades y referencias según el tipo de estudio
    const unidadesReferencias: Record<string, { unidad: string; referencia: string }> = {
      // Química sanguínea
      glucosa: { unidad: "mg/dL", referencia: "70-100" },
      glucosa_ayuno: { unidad: "mg/dL", referencia: "70-100" },
      glucosa_postprandial: { unidad: "mg/dL", referencia: "<140" },
      hemoglobina_glicosilada: { unidad: "%", referencia: "<5.7" },
      insulina: { unidad: "μUI/mL", referencia: "2.6-24.9" },
      acido_urico: { unidad: "mg/dL", referencia: "3.4-7.0" },
      creatinina: { unidad: "mg/dL", referencia: "0.6-1.2" },
      urea: { unidad: "mg/dL", referencia: "10-50" },
      nitrogeno_ureico: { unidad: "mg/dL", referencia: "7-20" },
      proteinas_totales: { unidad: "g/dL", referencia: "6.4-8.3" },
      albumina: { unidad: "g/dL", referencia: "3.5-5.0" },
      globulina: { unidad: "g/dL", referencia: "2.3-3.5" },
      relacion_albumina_globulina: { unidad: "", referencia: "1.2-2.2" },

      // Perfil lipídico
      colesterol: { unidad: "mg/dL", referencia: "<200" },
      colesterol_total: { unidad: "mg/dL", referencia: "<200" },
      trigliceridos: { unidad: "mg/dL", referencia: "<150" },
      hdl: { unidad: "mg/dL", referencia: ">40" },
      ldl: { unidad: "mg/dL", referencia: "<100" },
      vldl: { unidad: "mg/dL", referencia: "<30" },
      indice_aterogenico: { unidad: "", referencia: "<4.5" },

      // Perfil hepático
      bilirrubina_total: { unidad: "mg/dL", referencia: "0.3-1.0" },
      bilirrubina_directa: { unidad: "mg/dL", referencia: "0.0-0.3" },
      bilirrubina_indirecta: { unidad: "mg/dL", referencia: "0.1-0.7" },
      tgo_ast: { unidad: "U/L", referencia: "5-40" },
      tgp_alt: { unidad: "U/L", referencia: "7-56" },
      fosfatasa_alcalina: { unidad: "U/L", referencia: "44-147" },
      ggt: { unidad: "U/L", referencia: "8-61" },
      ldh: { unidad: "U/L", referencia: "140-280" },

      // Electrolitos
      sodio: { unidad: "mEq/L", referencia: "135-145" },
      potasio: { unidad: "mEq/L", referencia: "3.5-5.0" },
      cloro: { unidad: "mEq/L", referencia: "98-107" },
      calcio: { unidad: "mg/dL", referencia: "8.5-10.5" },
      fosforo: { unidad: "mg/dL", referencia: "2.5-4.5" },
      magnesio: { unidad: "mg/dL", referencia: "1.7-2.2" },

      // Hemograma
      hemoglobina: { unidad: "g/dL", referencia: "12-16" },
      hematocrito: { unidad: "%", referencia: "36-46" },
      leucocitos: { unidad: "/mm³", referencia: "4500-11000" },
      plaquetas: { unidad: "/mm³", referencia: "150000-450000" },
      eritrocitos: { unidad: "millones/mm³", referencia: "4.2-5.4" },
      vcm: { unidad: "fL", referencia: "80-96" },
      hcm: { unidad: "pg", referencia: "27-32" },
      chcm: { unidad: "g/dL", referencia: "32-36" },
      rdw: { unidad: "%", referencia: "11.5-14.5" },
      neutrofilos: { unidad: "%", referencia: "40-70" },
      linfocitos: { unidad: "%", referencia: "20-40" },
      monocitos: { unidad: "%", referencia: "2-10" },
      eosinofilos: { unidad: "%", referencia: "1-4" },
      basofilos: { unidad: "%", referencia: "0-1" },
      neutrofilos_absolutos: { unidad: "/mm³", referencia: "1800-7700" },
      linfocitos_absolutos: { unidad: "/mm³", referencia: "1000-4800" },
      monocitos_absolutos: { unidad: "/mm³", referencia: "200-950" },
      eosinofilos_absolutos: { unidad: "/mm³", referencia: "15-500" },
      basofilos_absolutos: { unidad: "/mm³", referencia: "0-200" },

      // Perfil tiroideo
      tsh: { unidad: "μUI/mL", referencia: "0.4-4.0" },
      t4_libre: { unidad: "ng/dL", referencia: "0.8-1.8" },
      t3_total: { unidad: "ng/dL", referencia: "80-200" },
      t3_libre: { unidad: "pg/mL", referencia: "2.3-4.2" },
      t4_total: { unidad: "μg/dL", referencia: "5.1-14.1" },
      anticuerpos_antitiroideos: { unidad: "UI/mL", referencia: "<35" },
      anticuerpos_antitiroglobulina: { unidad: "UI/mL", referencia: "<40" },
      anticuerpos_antimicrosomales: { unidad: "UI/mL", referencia: "<35" },

      // Marcadores cardíacos
      ck_total: { unidad: "U/L", referencia: "30-200" },
      ck_mb: { unidad: "U/L", referencia: "<25" },
      troponina_i: { unidad: "ng/mL", referencia: "<0.04" },
      troponina_t: { unidad: "ng/mL", referencia: "<0.01" },
      mioglobina: { unidad: "ng/mL", referencia: "<90" },
      bnp: { unidad: "pg/mL", referencia: "<100" },
      pro_bnp: { unidad: "pg/mL", referencia: "<125" },

      // Marcadores inflamatorios
      pcr: { unidad: "mg/L", referencia: "<5" },
      pcr_ultrasensible: { unidad: "mg/L", referencia: "<3" },
      vsg: { unidad: "mm/h", referencia: "<20" },
      factor_reumatoide: { unidad: "UI/mL", referencia: "<14" },

      // Pruebas de coagulación
      tiempo_protrombina: { unidad: "seg", referencia: "11-13.5" },
      inr: { unidad: "", referencia: "0.8-1.2" },
      tiempo_tromboplastina: { unidad: "seg", referencia: "25-35" },
      fibrinogeno: { unidad: "mg/dL", referencia: "200-400" },
      dimero_d: { unidad: "ng/mL", referencia: "<500" },

      // Análisis de orina
      ph_orina: { unidad: "", referencia: "5.0-7.0" },
      densidad_orina: { unidad: "", referencia: "1.010-1.025" },
      proteinas_orina: { unidad: "", referencia: "Negativo" },
      glucosa_orina: { unidad: "", referencia: "Negativo" },
      cetonas_orina: { unidad: "", referencia: "Negativo" },
      sangre_orina: { unidad: "", referencia: "Negativo" },
      leucocitos_orina: { unidad: "/campo", referencia: "0-5" },
      eritrocitos_orina: { unidad: "/campo", referencia: "0-3" },

      // Otros marcadores
      ferritina: { unidad: "ng/mL", referencia: "30-400" },
      hierro: { unidad: "μg/dL", referencia: "60-170" },
      transferrina: { unidad: "mg/dL", referencia: "200-360" },
      saturacion_transferrina: { unidad: "%", referencia: "20-50" },
      vitamina_b12: { unidad: "pg/mL", referencia: "200-900" },
      acido_folico: { unidad: "ng/mL", referencia: "3-17" },
      vitamina_d: { unidad: "ng/mL", referencia: "30-100" },
      psa_total: { unidad: "ng/mL", referencia: "<4" },
      psa_libre: { unidad: "ng/mL", referencia: ">25% del total" },
      ca_125: { unidad: "U/mL", referencia: "<35" },
      cea: { unidad: "ng/mL", referencia: "<5" },
      afp: { unidad: "ng/mL", referencia: "<10" },
      hcg: { unidad: "mUI/mL", referencia: "<5" },
    }

    // Procesar cada parámetro del resultado
    Object.entries(resultado.niveles).forEach(([key, value]) => {
      parametrosFormateados[key] = {
        valor: value.valor,
        unidad: unidadesReferencias[key]?.unidad || "",
        referencia: unidadesReferencias[key]?.referencia || "",
        nivel: value.nivel,
        interpretacion: value.interpretacion,
      }
    })

    return parametrosFormateados
  },

  // Generar hallazgos y recomendaciones basados en los parámetros
  generarAnalisis(parametros: Record<string, any>, tipoEstudio: string): any {
    const resultados = {
      interpretacion: "",
      hallazgos: [] as string[],
      recomendaciones: [] as string[],
      resultado_general: "",
    }

    // Contar parámetros alterados
    let parametrosAlterados = 0
    let parametrosAltos = 0
    let parametrosBajos = 0

    // Analizar cada parámetro
    Object.entries(parametros).forEach(([key, value]: [string, any]) => {
      if (value.nivel !== 1) {
        // Si no es normal
        parametrosAlterados++

        if (value.nivel === 2) {
          // Alto
          parametrosAltos++

          // Generar hallazgos y recomendaciones específicos según el parámetro
          switch (key) {
            // Química sanguínea
            case "glucosa":
            case "glucosa_ayuno":
              resultados.hallazgos.push("Hiperglucemia: posible prediabetes o diabetes")
              resultados.recomendaciones.push("Control dietético y actividad física")
              resultados.recomendaciones.push("Evaluación por especialista en endocrinología")
              resultados.recomendaciones.push("Considerar prueba de hemoglobina glicosilada (HbA1c)")
              break
            case "glucosa_postprandial":
              resultados.hallazgos.push("Hiperglucemia postprandial: posible intolerancia a la glucosa o diabetes")
              resultados.recomendaciones.push("Control dietético con reducción de carbohidratos simples")
              resultados.recomendaciones.push("Evaluación por especialista en endocrinología")
              break
            case "hemoglobina_glicosilada":
              resultados.hallazgos.push("Hemoglobina glicosilada elevada: control glucémico deficiente")
              resultados.recomendaciones.push("Ajuste del tratamiento para diabetes")
              resultados.recomendaciones.push("Evaluación por especialista en endocrinología")
              break
            case "insulina":
              resultados.hallazgos.push("Hiperinsulinemia: posible resistencia a la insulina")
              resultados.recomendaciones.push("Control de peso y actividad física")
              resultados.recomendaciones.push("Evaluación por especialista en endocrinología")
              break
            case "acido_urico":
              resultados.hallazgos.push("Hiperuricemia: riesgo de gota y litiasis renal")
              resultados.recomendaciones.push("Dieta baja en purinas")
              resultados.recomendaciones.push("Aumentar ingesta de líquidos")
              resultados.recomendaciones.push("Evaluación por reumatología si hay síntomas articulares")
              break
            case "creatinina":
              resultados.hallazgos.push("Creatinina elevada: posible alteración de la función renal")
              resultados.recomendaciones.push("Evaluación nefrológica")
              resultados.recomendaciones.push("Hidratación adecuada")
              resultados.recomendaciones.push("Considerar cálculo de tasa de filtración glomerular")
              break
            case "urea":
            case "nitrogeno_ureico":
              resultados.hallazgos.push("Urea/BUN elevado: posible alteración de la función renal")
              resultados.recomendaciones.push("Evaluación de la función renal")
              resultados.recomendaciones.push("Hidratación adecuada")
              break
            case "proteinas_totales":
              resultados.hallazgos.push("Proteínas totales elevadas: posible deshidratación o gammapatía")
              resultados.recomendaciones.push("Evaluación clínica completa")
              resultados.recomendaciones.push("Considerar electroforesis de proteínas")
              break
            case "albumina":
              resultados.hallazgos.push("Albúmina elevada: posible deshidratación")
              resultados.recomendaciones.push("Hidratación adecuada")
              break
            case "globulina":
              resultados.hallazgos.push("Globulinas elevadas: posible proceso inflamatorio o infeccioso crónico")
              resultados.recomendaciones.push("Evaluación clínica completa")
              resultados.recomendaciones.push("Considerar electroforesis de proteínas")
              break

            // Perfil lipídico
            case "colesterol":
            case "colesterol_total":
              resultados.hallazgos.push("Hipercolesterolemia: riesgo cardiovascular aumentado")
              resultados.recomendaciones.push("Dieta baja en grasas saturadas")
              resultados.recomendaciones.push("Actividad física regular")
              resultados.recomendaciones.push("Considerar tratamiento farmacológico si persiste elevado")
              break
            case "trigliceridos":
              resultados.hallazgos.push("Hipertrigliceridemia: riesgo cardiovascular aumentado")
              resultados.recomendaciones.push("Reducción de consumo de carbohidratos simples y alcohol")
              resultados.recomendaciones.push("Aumentar actividad física")
              resultados.recomendaciones.push("Control de peso")
              break
            case "ldl":
              resultados.hallazgos.push("LDL elevado: riesgo cardiovascular aumentado")
              resultados.recomendaciones.push("Dieta baja en grasas saturadas")
              resultados.recomendaciones.push("Actividad física regular")
              resultados.recomendaciones.push("Considerar tratamiento con estatinas según riesgo cardiovascular global")
              break
            case "vldl":
              resultados.hallazgos.push("VLDL elevado: alteración en el metabolismo de triglicéridos")
              resultados.recomendaciones.push("Reducción de consumo de carbohidratos simples")
              resultados.recomendaciones.push("Control de peso")
              break
            case "indice_aterogenico":
              resultados.hallazgos.push("Índice aterogénico elevado: mayor riesgo cardiovascular")
              resultados.recomendaciones.push("Evaluación cardiovascular completa")
              resultados.recomendaciones.push("Modificación intensiva del estilo de vida")
              break

            // Perfil hepático
            case "bilirrubina_total":
              resultados.hallazgos.push("Hiperbilirrubinemia: posible alteración hepática o hemólisis")
              resultados.recomendaciones.push("Evaluación hepatológica")
              resultados.recomendaciones.push("Descartar patología de vías biliares")
              break
            case "bilirrubina_directa":
              resultados.hallazgos.push("Bilirrubina directa elevada: posible obstrucción biliar")
              resultados.recomendaciones.push("Evaluación hepatológica")
              resultados.recomendaciones.push("Considerar ecografía abdominal")
              break
            case "bilirrubina_indirecta":
              resultados.hallazgos.push("Bilirrubina indirecta elevada: posible hemólisis o síndrome de Gilbert")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "tgo_ast":
              resultados.hallazgos.push("AST/TGO elevada: posible daño hepatocelular")
              resultados.recomendaciones.push("Evaluación hepatológica")
              resultados.recomendaciones.push("Evitar alcohol y medicamentos hepatotóxicos")
              break
            case "tgp_alt":
              resultados.hallazgos.push("ALT/TGP elevada: posible daño hepatocelular")
              resultados.recomendaciones.push("Evaluación hepatológica")
              resultados.recomendaciones.push("Evitar alcohol y medicamentos hepatotóxicos")
              break
            case "fosfatasa_alcalina":
              resultados.hallazgos.push("Fosfatasa alcalina elevada: posible patología biliar u ósea")
              resultados.recomendaciones.push("Evaluación hepatológica")
              resultados.recomendaciones.push("Considerar ecografía abdominal")
              break
            case "ggt":
              resultados.hallazgos.push("GGT elevada: posible patología hepatobiliar o consumo de alcohol")
              resultados.recomendaciones.push("Evaluación hepatológica")
              resultados.recomendaciones.push("Suspender consumo de alcohol")
              break
            case "ldh":
              resultados.hallazgos.push("LDH elevada: posible daño tisular")
              resultados.recomendaciones.push("Evaluación clínica completa")
              break

            // Electrolitos
            case "sodio":
              resultados.hallazgos.push("Hipernatremia: posible deshidratación")
              resultados.recomendaciones.push("Hidratación adecuada")
              resultados.recomendaciones.push("Evaluación de la función renal")
              break
            case "potasio":
              resultados.hallazgos.push("Hiperpotasemia: riesgo de arritmias cardíacas")
              resultados.recomendaciones.push("Evaluación cardiológica urgente")
              resultados.recomendaciones.push("Evaluación de la función renal")
              resultados.recomendaciones.push("Revisar medicación (IECA, ARA-II, diuréticos ahorradores de potasio)")
              break
            case "cloro":
              resultados.hallazgos.push("Hipercloremia: posible acidosis metabólica")
              resultados.recomendaciones.push("Evaluación del equilibrio ácido-base")
              break
            case "calcio":
              resultados.hallazgos.push("Hipercalcemia: posible hiperparatiroidismo o malignidad")
              resultados.recomendaciones.push("Evaluación endocrinológica")
              resultados.recomendaciones.push("Considerar medición de PTH")
              break
            case "fosforo":
              resultados.hallazgos.push("Hiperfosfatemia: posible insuficiencia renal")
              resultados.recomendaciones.push("Evaluación de la función renal")
              break
            case "magnesio":
              resultados.hallazgos.push("Hipermagnesemia: posible insuficiencia renal")
              resultados.recomendaciones.push("Evaluación de la función renal")
              resultados.recomendaciones.push("Revisar medicación (antiácidos con magnesio)")
              break

            // Hemograma
            case "hemoglobina":
              resultados.hallazgos.push("Hemoglobina elevada: posible policitemia")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Descartar deshidratación")
              resultados.recomendaciones.push("Considerar estudio de eritropoyetina")
              break
            case "hematocrito":
              resultados.hallazgos.push("Hematocrito elevado: posible policitemia o deshidratación")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Hidratación adecuada")
              break
            case "leucocitos":
              resultados.hallazgos.push("Leucocitosis: posible proceso infeccioso o inflamatorio")
              resultados.recomendaciones.push("Evaluación clínica para descartar infección")
              resultados.recomendaciones.push("Considerar pruebas adicionales según sintomatología")
              break
            case "neutrofilos":
            case "neutrofilos_absolutos":
              resultados.hallazgos.push("Neutrofilia: posible infección bacteriana o inflamación aguda")
              resultados.recomendaciones.push("Evaluación clínica para descartar infección")
              break
            case "linfocitos":
            case "linfocitos_absolutos":
              resultados.hallazgos.push("Linfocitosis: posible infección viral o trastorno linfoproliferativo")
              resultados.recomendaciones.push("Evaluación clínica completa")
              break
            case "monocitos":
            case "monocitos_absolutos":
              resultados.hallazgos.push("Monocitosis: posible infección crónica o trastorno mieloproliferativo")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "eosinofilos":
            case "eosinofilos_absolutos":
              resultados.hallazgos.push("Eosinofilia: posible alergia, parasitosis o trastorno autoinmune")
              resultados.recomendaciones.push("Evaluación alergológica")
              resultados.recomendaciones.push("Considerar estudio parasitológico")
              break
            case "basofilos":
            case "basofilos_absolutos":
              resultados.hallazgos.push("Basofilia: posible reacción alérgica o trastorno mieloproliferativo")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "plaquetas":
              resultados.hallazgos.push("Trombocitosis: posible trastorno mieloproliferativo o inflamación crónica")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Descartar deficiencia de hierro")
              break
            case "vcm":
              resultados.hallazgos.push("VCM elevado: posible anemia macrocítica")
              resultados.recomendaciones.push("Evaluación de niveles de vitamina B12 y ácido fólico")
              resultados.recomendaciones.push("Descartar alcoholismo")
              break
            case "hcm":
              resultados.hallazgos.push("HCM elevado: posible macrocitosis")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "chcm":
              resultados.hallazgos.push("CHCM elevado: posible esferocitosis o error de laboratorio")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "rdw":
              resultados.hallazgos.push("RDW elevado: mayor variabilidad en el tamaño de los eritrocitos")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Descartar deficiencia de hierro")
              break

            // Perfil tiroideo
            case "tsh":
              resultados.hallazgos.push("TSH elevada: posible hipotiroidismo")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              resultados.recomendaciones.push("Considerar medición de anticuerpos antitiroideos")
              break
            case "t4_libre":
              resultados.hallazgos.push("T4 libre elevada: posible hipertiroidismo")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              resultados.recomendaciones.push("Considerar medición de anticuerpos antitiroideos")
              break
            case "t3_total":
            case "t3_libre":
              resultados.hallazgos.push("T3 elevada: posible hipertiroidismo")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              break
            case "t4_total":
              resultados.hallazgos.push("T4 total elevada: posible hipertiroidismo")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              break
            case "anticuerpos_antitiroideos":
            case "anticuerpos_antitiroglobulina":
            case "anticuerpos_antimicrosomales":
              resultados.hallazgos.push("Anticuerpos antitiroideos elevados: posible enfermedad tiroidea autoinmune")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              resultados.recomendaciones.push("Seguimiento periódico de función tiroidea")
              break

            // Marcadores cardíacos
            case "ck_total":
              resultados.hallazgos.push("CK total elevada: posible daño muscular")
              resultados.recomendaciones.push("Evaluación cardiológica")
              resultados.recomendaciones.push("Descartar ejercicio intenso reciente")
              break
            case "ck_mb":
              resultados.hallazgos.push("CK-MB elevada: posible daño miocárdico")
              resultados.recomendaciones.push("Evaluación cardiológica urgente")
              resultados.recomendaciones.push("Considerar electrocardiograma")
              break
            case "troponina_i":
            case "troponina_t":
              resultados.hallazgos.push("Troponina elevada: posible infarto agudo de miocardio")
              resultados.recomendaciones.push("Evaluación cardiológica urgente")
              resultados.recomendaciones.push("Electrocardiograma y monitorización")
              break
            case "mioglobina":
              resultados.hallazgos.push("Mioglobina elevada: posible daño muscular o miocárdico")
              resultados.recomendaciones.push("Evaluación clínica urgente")
              break
            case "bnp":
            case "pro_bnp":
              resultados.hallazgos.push("BNP/Pro-BNP elevado: posible insuficiencia cardíaca")
              resultados.recomendaciones.push("Evaluación cardiológica")
              resultados.recomendaciones.push("Considerar ecocardiograma")
              break

            // Marcadores inflamatorios
            case "pcr":
            case "pcr_ultrasensible":
              resultados.hallazgos.push("PCR elevada: proceso inflamatorio activo")
              resultados.recomendaciones.push("Evaluación clínica completa")
              resultados.recomendaciones.push("Buscar foco infeccioso o inflamatorio")
              break
            case "vsg":
              resultados.hallazgos.push("VSG elevada: proceso inflamatorio crónico")
              resultados.recomendaciones.push("Evaluación clínica completa")
              resultados.recomendaciones.push("Considerar enfermedades autoinmunes")
              break
            case "factor_reumatoide":
              resultados.hallazgos.push(
                "Factor reumatoide elevado: posible artritis reumatoide u otra enfermedad autoinmune",
              )
              resultados.recomendaciones.push("Evaluación reumatológica")
              break

            // Pruebas de coagulación
            case "tiempo_protrombina":
              resultados.hallazgos.push("Tiempo de protrombina prolongado: alteración de la coagulación")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Descartar enfermedad hepática")
              break
            case "inr":
              resultados.hallazgos.push("INR elevado: anticoagulación excesiva o alteración de la coagulación")
              resultados.recomendaciones.push("Ajuste de dosis de anticoagulantes si está en tratamiento")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "tiempo_tromboplastina":
              resultados.hallazgos.push("Tiempo de tromboplastina prolongado: alteración de la coagulación")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "fibrinogeno":
              resultados.hallazgos.push("Fibrinógeno elevado: estado inflamatorio o protrombótico")
              resultados.recomendaciones.push("Evaluación clínica completa")
              break
            case "dimero_d":
              resultados.hallazgos.push("Dímero D elevado: posible trombosis o embolia")
              resultados.recomendaciones.push("Evaluación urgente para descartar tromboembolismo")
              resultados.recomendaciones.push("Considerar angiotomografía pulmonar o ecografía Doppler")
              break

            // Otros marcadores
            case "ferritina":
              resultados.hallazgos.push("Ferritina elevada: sobrecarga de hierro o inflamación")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Descartar hemocromatosis")
              break
            case "hierro":
              resultados.hallazgos.push("Hierro sérico elevado: posible sobrecarga de hierro")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Considerar estudio genético para hemocromatosis")
              break
            case "vitamina_b12":
              resultados.hallazgos.push("Vitamina B12 elevada: rara vez significativo clínicamente")
              resultados.recomendaciones.push("Verificar suplementación")
              break
            case "acido_folico":
              resultados.hallazgos.push("Ácido fólico elevado: rara vez significativo clínicamente")
              resultados.recomendaciones.push("Verificar suplementación")
              break
            case "vitamina_d":
              resultados.hallazgos.push("Vitamina D elevada: posible sobredosificación")
              resultados.recomendaciones.push("Ajustar dosis de suplementos")
              resultados.recomendaciones.push("Monitorizar niveles de calcio")
              break
            case "psa_total":
              resultados.hallazgos.push("PSA elevado: posible patología prostática")
              resultados.recomendaciones.push("Evaluación urológica")
              resultados.recomendaciones.push("Considerar biopsia prostática según criterio médico")
              break
            case "ca_125":
              resultados.hallazgos.push("CA-125 elevado: posible patología ovárica")
              resultados.recomendaciones.push("Evaluación ginecológica")
              resultados.recomendaciones.push("Considerar ecografía pélvica")
              break
            case "cea":
              resultados.hallazgos.push("CEA elevado: posible neoplasia")
              resultados.recomendaciones.push("Evaluación oncológica")
              resultados.recomendaciones.push("Considerar estudios de imagen")
              break
            case "afp":
              resultados.hallazgos.push("AFP elevada: posible patología hepática o tumoral")
              resultados.recomendaciones.push("Evaluación hepatológica y oncológica")
              resultados.recomendaciones.push("Considerar estudios de imagen abdominal")
              break
            case "hcg":
              resultados.hallazgos.push("HCG elevada: posible embarazo o patología tumoral")
              resultados.recomendaciones.push("Descartar embarazo")
              resultados.recomendaciones.push("Evaluación ginecológica u oncológica")
              break
            default:
              resultados.hallazgos.push(`${key.replace(/_/g, " ")} elevado: requiere seguimiento`)
              resultados.recomendaciones.push(`Control periódico de ${key.replace(/_/g, " ")}`)
          }
        } else if (value.nivel === 0) {
          // Bajo
          parametrosBajos++

          // Generar hallazgos y recomendaciones específicos según el parámetro
          switch (key) {
            // Química sanguínea
            case "glucosa":
            case "glucosa_ayuno":
              resultados.hallazgos.push("Hipoglucemia: posible alteración metabólica")
              resultados.recomendaciones.push("Evaluación por especialista en endocrinología")
              resultados.recomendaciones.push("Considerar prueba de tolerancia a la glucosa")
              break
            case "insulina":
              resultados.hallazgos.push("Insulina baja: posible deficiencia pancreática")
              resultados.recomendaciones.push("Evaluación por especialista en endocrinología")
              break
            case "acido_urico":
              resultados.hallazgos.push("Ácido úrico bajo: posible alteración metabólica")
              resultados.recomendaciones.push("Evaluación de la dieta y función hepática")
              break
            case "creatinina":
              resultados.hallazgos.push("Creatinina baja: posible disminución de masa muscular")
              resultados.recomendaciones.push("Evaluación nutricional")
              break
            case "urea":
            case "nitrogeno_ureico":
              resultados.hallazgos.push("Urea/BUN bajo: posible malnutrición o enfermedad hepática")
              resultados.recomendaciones.push("Evaluación nutricional")
              resultados.recomendaciones.push("Considerar evaluación hepática")
              break
            case "proteinas_totales":
              resultados.hallazgos.push("Proteínas totales bajas: posible malnutrición o pérdida proteica")
              resultados.recomendaciones.push("Evaluación nutricional")
              resultados.recomendaciones.push("Descartar enfermedad renal o hepática")
              break
            case "albumina":
              resultados.hallazgos.push("Albúmina baja: posible malnutrición, enfermedad hepática o renal")
              resultados.recomendaciones.push("Evaluación nutricional")
              resultados.recomendaciones.push("Descartar enfermedad hepática o renal")
              break
            case "globulina":
              resultados.hallazgos.push("Globulinas bajas: posible inmunodeficiencia")
              resultados.recomendaciones.push("Evaluación inmunológica")
              break

            // Perfil lipídico
            case "hdl":
              resultados.hallazgos.push("HDL bajo: mayor riesgo cardiovascular")
              resultados.recomendaciones.push("Aumentar actividad física")
              resultados.recomendaciones.push("Dieta mediterránea")
              resultados.recomendaciones.push("Evitar tabaquismo")
              break

            // Electrolitos
            case "sodio":
              resultados.hallazgos.push("Hiponatremia: alteración del balance hidroelectrolítico")
              resultados.recomendaciones.push("Evaluación clínica urgente")
              resultados.recomendaciones.push("Revisar medicación (diuréticos)")
              break
            case "potasio":
              resultados.hallazgos.push("Hipopotasemia: riesgo de arritmias cardíacas")
              resultados.recomendaciones.push("Evaluación cardiológica")
              resultados.recomendaciones.push("Suplementación de potasio")
              resultados.recomendaciones.push("Revisar medicación (diuréticos)")
              break
            case "cloro":
              resultados.hallazgos.push("Hipocloremia: posible alcalosis metabólica")
              resultados.recomendaciones.push("Evaluación del equilibrio ácido-base")
              break
            case "calcio":
              resultados.hallazgos.push("Hipocalcemia: posible hipoparatiroidismo o déficit de vitamina D")
              resultados.recomendaciones.push("Evaluación endocrinológica")
              resultados.recomendaciones.push("Considerar medición de PTH y vitamina D")
              break
            case "fosforo":
              resultados.hallazgos.push("Hipofosfatemia: posible malnutrición o alcoholismo")
              resultados.recomendaciones.push("Evaluación nutricional")
              break
            case "magnesio":
              resultados.hallazgos.push("Hipomagnesemia: posible malabsorción o alcoholismo")
              resultados.recomendaciones.push("Suplementación de magnesio")
              resultados.recomendaciones.push("Evaluación nutricional")
              break

            // Hemograma
            case "hemoglobina":
              resultados.hallazgos.push("Hemoglobina baja: anemia")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Estudio de perfil férrico")
              resultados.recomendaciones.push("Considerar suplementación con hierro")
              break
            case "hematocrito":
              resultados.hallazgos.push("Hematocrito bajo: anemia o hemodilución")
              resultados.recomendaciones.push("Evaluación hematológica")
              break
            case "leucocitos":
              resultados.hallazgos.push("Leucopenia: posible infección viral, fármacos o enfermedad autoinmune")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Revisar medicación")
              break
            case "neutrofilos":
            case "neutrofilos_absolutos":
              resultados.hallazgos.push("Neutropenia: mayor riesgo de infecciones bacterianas")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Revisar medicación")
              resultados.recomendaciones.push("Precauciones para evitar infecciones")
              break
            case "linfocitos":
            case "linfocitos_absolutos":
              resultados.hallazgos.push("Linfopenia: posible inmunosupresión")
              resultados.recomendaciones.push("Evaluación inmunológica")
              resultados.recomendaciones.push("Descartar infección por VIH")
              break
            case "plaquetas":
              resultados.hallazgos.push("Trombocitopenia: riesgo de sangrado")
              resultados.recomendaciones.push("Evaluación hematológica")
              resultados.recomendaciones.push("Evitar antiagregantes y anticoagulantes")
              resultados.recomendaciones.push("Precauciones para evitar traumatismos")
              break
            case "vcm":
              resultados.hallazgos.push("VCM bajo: anemia microcítica, posible déficit de hierro")
              resultados.recomendaciones.push("Estudio de perfil férrico")
              resultados.recomendaciones.push("Considerar suplementación con hierro")
              break
            case "hcm":
              resultados.hallazgos.push("HCM bajo: posible déficit de hierro")
              resultados.recomendaciones.push("Estudio de perfil férrico")
              break
            case "chcm":
              resultados.hallazgos.push("CHCM bajo: posible déficit de hierro")
              resultados.recomendaciones.push("Estudio de perfil férrico")
              break

            // Perfil tiroideo
            case "tsh":
              resultados.hallazgos.push("TSH disminuida: posible hipertiroidismo")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              resultados.recomendaciones.push("Considerar medición de anticuerpos antitiroideos")
              break
            case "t4_libre":
            case "t4_total":
              resultados.hallazgos.push("T4 baja: posible hipotiroidismo")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              break
            case "t3_total":
            case "t3_libre":
              resultados.hallazgos.push("T3 baja: posible hipotiroidismo o síndrome del eutiroideo enfermo")
              resultados.recomendaciones.push("Evaluación por endocrinología")
              break

            // Otros marcadores
            case "ferritina":
              resultados.hallazgos.push("Ferritina baja: déficit de hierro")
              resultados.recomendaciones.push("Suplementación con hierro")
              resultados.recomendaciones.push("Investigar posibles pérdidas sanguíneas")
              break
            case "hierro":
              resultados.hallazgos.push("Hierro sérico bajo: posible anemia ferropénica")
              resultados.recomendaciones.push("Suplementación con hierro")
              resultados.recomendaciones.push("Investigar posibles pérdidas sanguíneas")
              break
            case "transferrina":
              resultados.hallazgos.push("Transferrina baja: posible malnutrición o enfermedad hepática")
              resultados.recomendaciones.push("Evaluación nutricional")
              resultados.recomendaciones.push("Considerar evaluación hepática")
              break
            case "saturacion_transferrina":
              resultados.hallazgos.push("Saturación de transferrina baja: déficit de hierro")
              resultados.recomendaciones.push("Suplementación con hierro")
              break
            case "vitamina_b12":
              resultados.hallazgos.push("Vitamina B12 baja: posible anemia perniciosa o malabsorción")
              resultados.recomendaciones.push("Suplementación con vitamina B12")
              resultados.recomendaciones.push("Evaluación gastroenterológica")
              break
            case "acido_folico":
              resultados.hallazgos.push("Ácido fólico bajo: posible déficit nutricional")
              resultados.recomendaciones.push("Suplementación con ácido fólico")
              resultados.recomendaciones.push("Aumentar consumo de vegetales verdes")
              break
            case "vitamina_d":
              resultados.hallazgos.push("Vitamina D baja: déficit nutricional o exposición solar insuficiente")
              resultados.recomendaciones.push("Suplementación con vitamina D")
              resultados.recomendaciones.push("Exposición solar moderada")
              resultados.recomendaciones.push("Considerar densitometría ósea")
              break
            default:
              resultados.hallazgos.push(`${key.replace(/_/g, " ")} disminuido: requiere seguimiento`)
              resultados.recomendaciones.push(`Control periódico de ${key.replace(/_/g, " ")}`)
          }
        }
      }
    })

    // Generar interpretación general
    if (parametrosAlterados === 0) {
      resultados.interpretacion =
        "Los resultados se encuentran dentro de los rangos normales. No se observan alteraciones significativas."
      resultados.recomendaciones.push("Continuar con controles de rutina")
      resultados.resultado_general = "normal"
    } else {
      // Determinar la gravedad según la cantidad de parámetros alterados
      let gravedad = "leve"
      if (parametrosAlterados > 3 || (parametrosAltos > 1 && parametrosBajos > 1)) {
        gravedad = "significativa"
      } else if (parametrosAlterados > 1) {
        gravedad = "moderada"
      }

      resultados.interpretacion = `Se observan ${parametrosAlterados} parámetros alterados que indican una alteración ${gravedad}. Se recomienda seguimiento médico.`
      resultados.resultado_general = "alterado"
    }

    // Añadir recomendaciones generales según el tipo de estudio
    switch (tipoEstudio.toLowerCase()) {
      case "quimica_sanguinea":
        if (parametrosAlterados > 0) {
          resultados.recomendaciones.push("Repetir estudio en 3 meses para valorar evolución")

          // Recomendaciones específicas para alteraciones metabólicas
          if (parametros.glucosa?.nivel === 2) {
            resultados.recomendaciones.push("Mantener una dieta baja en azúcares refinados")
            resultados.recomendaciones.push("Realizar actividad física regular (150 minutos semanales)")
          }

          if (parametros.colesterol?.nivel === 2 || parametros.trigliceridos?.nivel === 2) {
            resultados.recomendaciones.push("Dieta baja en grasas saturadas y azúcares refinados")
            resultados.recomendaciones.push("Aumentar consumo de fibra y ácidos grasos omega-3")
          }
        } else {
          resultados.recomendaciones.push("Control anual de química sanguínea")
        }
        break

      case "hemograma":
        if (parametrosAlterados > 0) {
          resultados.recomendaciones.push("Valoración hematológica")

          // Recomendaciones específicas para alteraciones hematológicas
          if (parametros.hemoglobina?.nivel === 0 || parametros.hematocrito?.nivel === 0) {
            resultados.recomendaciones.push("Dieta rica en hierro (carnes rojas, legumbres, vegetales de hoja verde)")
            resultados.recomendaciones.push(
              "Consumir vitamina C junto con alimentos ricos en hierro para mejorar su absorción",
            )
          }

          if (parametros.leucocitos?.nivel !== 1) {
            resultados.recomendaciones.push("Evitar automedicación con antibióticos")
          }
        } else {
          resultados.recomendaciones.push("Control anual de hemograma")
        }
        break

      case "perfil_tiroideo":
        if (parametrosAlterados > 0) {
          resultados.recomendaciones.push("Valoración por endocrinología")

          // Recomendaciones específicas para alteraciones tiroideas
          if (parametros.tsh?.nivel === 2) {
            resultados.recomendaciones.push("Asegurar ingesta adecuada de yodo")
            resultados.recomendaciones.push("Evitar consumo excesivo de alimentos bociógenos (col, brócoli, coliflor)")
          }
        } else {
          resultados.recomendaciones.push("Control anual de perfil tiroideo")
        }
        break

      case "perfil_hepatico":
        if (parametrosAlterados > 0) {
          resultados.recomendaciones.push("Valoración hepatológica")
          resultados.recomendaciones.push("Evitar consumo de alcohol")
          resultados.recomendaciones.push("Revisar medicación hepatotóxica")
        } else {
          resultados.recomendaciones.push("Control anual de perfil hepático")
        }
        break

      case "perfil_lipidico":
        if (parametrosAlterados > 0) {
          resultados.recomendaciones.push("Valoración cardiológica")
          resultados.recomendaciones.push("Dieta mediterránea")
          resultados.recomendaciones.push("Actividad física regular (150 minutos semanales)")
        } else {
          resultados.recomendaciones.push("Control anual de perfil lipídico")
        }
        break

      case "perfil_renal":
        if (parametrosAlterados > 0) {
          resultados.recomendaciones.push("Valoración nefrológica")
          resultados.recomendaciones.push("Hidratación adecuada (2 litros de agua diarios)")
          resultados.recomendaciones.push("Control de presión arterial")
        } else {
          resultados.recomendaciones.push("Control anual de función renal")
        }
        break
    }

    // Eliminar recomendaciones duplicadas
    resultados.recomendaciones = [...new Set(resultados.recomendaciones)]

    return resultados
  },

  // Simulación de OCR para fallback
  simulateOCR(tipoEstudio: string): any {
    // Simulación de resultados OCR según el tipo de estudio
    switch (tipoEstudio) {
      case "hemograma":
        return {
          hemoglobina: { valor: Math.random() * 5 + 12, unidad: "g/dL", referencia: "12-16" },
          hematocrito: { valor: Math.random() * 10 + 35, unidad: "%", referencia: "36-46" },
          leucocitos: { valor: Math.random() * 5000 + 5000, unidad: "/mm³", referencia: "4500-11000" },
          plaquetas: { valor: Math.random() * 100000 + 150000, unidad: "/mm³", referencia: "150000-450000" },
          eritrocitos: { valor: Math.random() * 2 + 3, unidad: "millones/mm³", referencia: "4.2-5.4" },
          vcm: { valor: Math.random() * 10 + 80, unidad: "fL", referencia: "80-96" },
          hcm: { valor: Math.random() * 5 + 27, unidad: "pg", referencia: "27-32" },
          chcm: { valor: Math.random() * 5 + 30, unidad: "g/dL", referencia: "32-36" },
        }
      case "quimica_sanguinea":
        return {
          glucosa: { valor: Math.random() * 50 + 70, unidad: "mg/dL", referencia: "70-100" },
          urea: { valor: Math.random() * 20 + 10, unidad: "mg/dL", referencia: "10-50" },
          creatinina: { valor: Math.random() * 0.5 + 0.5, unidad: "mg/dL", referencia: "0.6-1.2" },
          acido_urico: { valor: Math.random() * 3 + 2, unidad: "mg/dL", referencia: "3.4-7.0" },
          colesterol_total: { valor: Math.random() * 100 + 120, unidad: "mg/dL", referencia: "<200" },
          trigliceridos: { valor: Math.random() * 100 + 50, unidad: "mg/dL", referencia: "<150" },
          hdl: { valor: Math.random() * 20 + 35, unidad: "mg/dL", referencia: ">40" },
          ldl: { valor: Math.random() * 50 + 50, unidad: "mg/dL", referencia: "<100" },
        }
      case "perfil_tiroideo":
        return {
          tsh: { valor: Math.random() * 3 + 0.5, unidad: "μUI/mL", referencia: "0.4-4.0" },
          t4_libre: { valor: Math.random() * 1 + 0.8, unidad: "ng/dL", referencia: "0.8-1.8" },
          t3_total: { valor: Math.random() * 50 + 80, unidad: "ng/dL", referencia: "80-200" },
          anticuerpos_antitiroideos: { valor: Math.random() * 20, unidad: "UI/mL", referencia: "<35" },
        }
      case "perfil_hepatico":
        return {
          bilirrubina_total: { valor: Math.random() * 0.7 + 0.3, unidad: "mg/dL", referencia: "0.3-1.0" },
          bilirrubina_directa: { valor: Math.random() * 0.2 + 0.1, unidad: "mg/dL", referencia: "0.0-0.3" },
          bilirrubina_indirecta: { valor: Math.random() * 0.5 + 0.2, unidad: "mg/dL", referencia: "0.1-0.7" },
          tgo_ast: { valor: Math.random() * 30 + 10, unidad: "U/L", referencia: "5-40" },
          tgp_alt: { valor: Math.random() * 40 + 10, unidad: "U/L", referencia: "7-56" },
          fosfatasa_alcalina: { valor: Math.random() * 80 + 60, unidad: "U/L", referencia: "44-147" },
          ggt: { valor: Math.random() * 40 + 10, unidad: "U/L", referencia: "8-61" },
        }
      case "perfil_lipidico":
        return {
          colesterol_total: { valor: Math.random() * 100 + 120, unidad: "mg/dL", referencia: "<200" },
          trigliceridos: { valor: Math.random() * 100 + 50, unidad: "mg/dL", referencia: "<150" },
          hdl: { valor: Math.random() * 20 + 35, unidad: "mg/dL", referencia: ">40" },
          ldl: { valor: Math.random() * 50 + 50, unidad: "mg/dL", referencia: "<100" },
          vldl: { valor: Math.random() * 20 + 10, unidad: "mg/dL", referencia: "<30" },
          indice_aterogenico: { valor: Math.random() * 3 + 1, unidad: "", referencia: "<4.5" },
        }
      case "perfil_renal":
        return {
          creatinina: { valor: Math.random() * 0.5 + 0.5, unidad: "mg/dL", referencia: "0.6-1.2" },
          urea: { valor: Math.random() * 20 + 10, unidad: "mg/dL", referencia: "10-50" },
          nitrogeno_ureico: { valor: Math.random() * 10 + 5, unidad: "mg/dL", referencia: "7-20" },
          acido_urico: { valor: Math.random() * 3 + 2, unidad: "mg/dL", referencia: "3.4-7.0" },
          proteinas_totales: { valor: Math.random() * 1.5 + 6.5, unidad: "g/dL", referencia: "6.4-8.3" },
          albumina: { valor: Math.random() * 1 + 3.5, unidad: "g/dL", referencia: "3.5-5.0" },
          globulina: { valor: Math.random() * 1 + 2.5, unidad: "g/dL", referencia: "2.3-3.5" },
        }
      case "orina":
        return {
          color: { valor: "Amarillo", referencia: "Amarillo" },
          aspecto: { valor: "Transparente", referencia: "Transparente" },
          ph_orina: { valor: Math.random() * 2 + 5, unidad: "", referencia: "5.0-7.0" },
          densidad_orina: { valor: Math.random() * 0.015 + 1.01, unidad: "", referencia: "1.010-1.025" },
          proteinas_orina: { valor: "Negativo", referencia: "Negativo" },
          glucosa_orina: { valor: "Negativo", referencia: "Negativo" },
          cetonas_orina: { valor: "Negativo", referencia: "Negativo" },
          sangre_orina: { valor: "Negativo", referencia: "Negativo" },
          leucocitos_orina: { valor: Math.random() * 3, unidad: "/campo", referencia: "0-5" },
          eritrocitos_orina: { valor: Math.random() * 2, unidad: "/campo", referencia: "0-3" },
        }
      case "rayos_x":
        return {
          region: { valor: "Tórax" },
          hallazgos: { valor: "Sin alteraciones significativas" },
          densidad_osea: { valor: "Normal" },
          espacios_articulares: { valor: "Conservados" },
          tejidos_blandos: { valor: "Sin alteraciones" },
        }
      default:
        return {}
    }
  },

  // Simulación de análisis de resultados (ahora reemplazado por generarAnalisis)
  simulateAnalysis(parametros: any, tipoEstudio: string): any {
    return this.generarAnalisis(parametros, tipoEstudio)
  },
}
