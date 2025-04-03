export interface Interpretacion {
    id: number
    fecha: string
    tipoEstudio: string
    archivoUrl?: string
    parametros?: any
    resultados?: any
    observaciones?: string
    estado: string
    pacienteId: number
    doctorId: number
    createdAt: string
    updatedAt: string
    paciente?: {
      nombre: string
    }
    doctor?: {
      nombre: string
    }
  }
  
  export interface InterpretacionPost {
    pacienteId: number
    doctorId: number
    fecha: string
    tipoEstudio: string
    archivoUrl?: string
    parametros?: any
    resultados?: any
    observaciones?: string
    estado?: string
  }
  
  export interface InterpretacionPut {
    parametros?: any
    resultados?: any
    observaciones?: string
    estado?: string
  }
  
  export const interpretacionesService = {
    // Obtener todas las interpretaciones de un paciente
    async getByPaciente(pacienteId: number, token: string): Promise<Interpretacion[]> {
      const response = await fetch(`/api/interpretaciones?pacienteId=${pacienteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error al obtener interpretaciones")
      }
  
      return response.json()
    },
  
    // Obtener todas las interpretaciones de un doctor
    async getByDoctor(doctorId: number, token: string): Promise<Interpretacion[]> {
      const response = await fetch(`/api/interpretaciones?doctorId=${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error al obtener interpretaciones")
      }
  
      return response.json()
    },
  
    // Obtener interpretaciones de un paciente atendido por un doctor específico
    async getByPacienteAndDoctor(pacienteId: number, doctorId: number, token: string): Promise<Interpretacion[]> {
      const response = await fetch(`/api/interpretaciones?pacienteId=${pacienteId}&doctorId=${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error al obtener interpretaciones")
      }
  
      return response.json()
    },
  
    // Obtener una interpretación por ID
    async getById(id: number, token: string): Promise<Interpretacion> {
      const response = await fetch(`/api/interpretaciones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error al obtener interpretación")
      }
  
      return response.json()
    },
  
    // Crear una nueva interpretación
    async create(interpretacion: InterpretacionPost, token: string): Promise<Interpretacion> {
      const response = await fetch("/api/interpretaciones", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interpretacion),
      })
  
      if (!response.ok) {
        throw new Error("Error al crear interpretación")
      }
  
      return response.json()
    },
  
    // Actualizar una interpretación
    async update(id: number, interpretacion: InterpretacionPut, token: string): Promise<Interpretacion> {
      const response = await fetch(`/api/interpretaciones/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interpretacion),
      })
  
      if (!response.ok) {
        throw new Error("Error al actualizar interpretación")
      }
  
      return response.json()
    },
  
    // Eliminar una interpretación
    async delete(id: number, token: string): Promise<void> {
      const response = await fetch(`/api/interpretaciones/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error al eliminar interpretación")
      }
    },
  
    // Subir archivo para interpretación
    async uploadFile(file: File, token: string): Promise<{ url: string; contentType: string }> {
      const formData = new FormData()
      formData.append("file", file)
  
      const response = await fetch("/api/interpretaciones/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
  
      if (!response.ok) {
        throw new Error("Error al subir archivo")
      }
  
      const data = await response.json()
      return {
        url: data.url,
        contentType: data.contentType,
      }
    },
  
    // Simular análisis OCR de un archivo
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
        case "orina":
          return {
            color: { valor: "Amarillo", referencia: "Amarillo" },
            aspecto: { valor: "Transparente", referencia: "Transparente" },
            ph: { valor: Math.random() * 2 + 5, unidad: "", referencia: "5.0-7.0" },
            densidad: { valor: Math.random() * 0.015 + 1.01, unidad: "", referencia: "1.010-1.025" },
            proteinas: { valor: "Negativo", referencia: "Negativo" },
            glucosa: { valor: "Negativo", referencia: "Negativo" },
            cetonas: { valor: "Negativo", referencia: "Negativo" },
            sangre: { valor: "Negativo", referencia: "Negativo" },
            leucocitos: { valor: Math.random() * 3, unidad: "/campo", referencia: "0-5" },
            eritrocitos: { valor: Math.random() * 2, unidad: "/campo", referencia: "0-3" },
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
  
    // Simular análisis de resultados
    simulateAnalysis(parametros: any, tipoEstudio: string): any {
      // Simulación de interpretación según los parámetros y tipo de estudio
      const resultados = {
        interpretacion: "",
        hallazgos: [],
        recomendaciones: [],
      }
  
      switch (tipoEstudio) {
        case "hemograma":
          if (parametros.hemoglobina.valor < 12) {
            resultados.hallazgos.push("Hemoglobina baja: posible anemia")
            resultados.recomendaciones.push("Suplementación con hierro")
          }
          if (parametros.leucocitos.valor > 11000) {
            resultados.hallazgos.push("Leucocitosis: posible proceso infeccioso")
            resultados.recomendaciones.push("Evaluación clínica para descartar infección")
          }
          if (parametros.plaquetas.valor < 150000) {
            resultados.hallazgos.push("Trombocitopenia: posible alteración en la coagulación")
            resultados.recomendaciones.push("Monitoreo de signos de sangrado")
          }
          break
        case "quimica_sanguinea":
          if (parametros.glucosa.valor > 100) {
            resultados.hallazgos.push("Hiperglucemia: posible prediabetes o diabetes")
            resultados.recomendaciones.push("Control dietético y actividad física")
          }
          if (parametros.colesterol_total.valor > 200) {
            resultados.hallazgos.push("Hipercolesterolemia: riesgo cardiovascular aumentado")
            resultados.recomendaciones.push("Dieta baja en grasas saturadas")
          }
          if (parametros.trigliceridos.valor > 150) {
            resultados.hallazgos.push("Hipertrigliceridemia: riesgo cardiovascular aumentado")
            resultados.recomendaciones.push("Reducción de consumo de carbohidratos simples")
          }
          break
        case "perfil_tiroideo":
          if (parametros.tsh.valor > 4.0) {
            resultados.hallazgos.push("TSH elevada: posible hipotiroidismo")
            resultados.recomendaciones.push("Evaluación por endocrinología")
          }
          if (parametros.tsh.valor < 0.4) {
            resultados.hallazgos.push("TSH disminuida: posible hipertiroidismo")
            resultados.recomendaciones.push("Evaluación por endocrinología")
          }
          break
        case "orina":
          if (parametros.proteinas.valor !== "Negativo") {
            resultados.hallazgos.push("Proteinuria: posible daño renal")
            resultados.recomendaciones.push("Evaluación de función renal")
          }
          if (parametros.leucocitos.valor > 5) {
            resultados.hallazgos.push("Leucocituria: posible infección urinaria")
            resultados.recomendaciones.push("Urocultivo y tratamiento antibiótico")
          }
          break
        case "rayos_x":
          if (parametros.hallazgos.valor !== "Sin alteraciones significativas") {
            resultados.hallazgos.push("Alteraciones radiográficas: requiere evaluación especializada")
            resultados.recomendaciones.push("Consulta con especialista")
          }
          break
      }
  
      // Generar interpretación general
      if (resultados.hallazgos.length === 0) {
        resultados.interpretacion =
          "Los resultados se encuentran dentro de los rangos normales. No se observan alteraciones significativas."
        resultados.recomendaciones.push("Continuar con controles de rutina")
      } else {
        resultados.interpretacion = `Se observan ${resultados.hallazgos.length} hallazgos que requieren atención. Se recomienda seguimiento médico.`
      }
  
      return resultados
    },
  }
  
  