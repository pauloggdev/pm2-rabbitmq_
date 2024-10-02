<template>
  <div id="home">
     <h1>Home</h1>
    <iframe id="blobPdf" v-for="(student, index) in students" :key="index" width="500" height="600"
      :src="student.docBI"></iframe>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      students: []
    }
  },
  mounted() {
    this.getAllStudents()
  },

  methods: {
    async getAllStudents() {
      const responseData = await axios.get('http://localhost:3000/getAllStudents');
      const students = responseData.data.map(response => ({
        ...response, // Mantém todas as propriedades do objeto original
        docBI: this.transformBlob(response.docBI.data)
      }));
      this.students = students;
    },
    transformBlob(data) {
      // Convertendo o objeto Buffer em um Blob
      const bufferData = new Uint8Array(data);
      const typeFile = this.identifyFileType(bufferData)
      const blob = new Blob([bufferData], {
        type: typeFile
      }); // Ajuste o tipo conforme necessário
      return URL.createObjectURL(blob);
    },
    identifyFileType(uint8Array) {
      // Verificar assinatura mágica dos primeiros bytes
      if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46) {
        return 'application/pdf'; // PDF
      } else if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
        return 'image/jpeg'; // JPEG
      } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
        return 'image/png'; // PNG
      } else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46) {
        return 'image/gif'; // GIF
      } else if (uint8Array[0] === 0x50 && uint8Array[1] === 0x4B && uint8Array[2] === 0x03 && uint8Array[3] === 0x04) {
        return 'application/zip'; // ZIP
      } else if (uint8Array[0] === 0xFF && uint8Array[1] === 0xFB) {
        return 'audio/mp3'; // MP3
      } else if (uint8Array[0] === 0x00 && uint8Array[1] === 0x00 && uint8Array[2] === 0x00 && uint8Array[3] === 0x18 &&
        uint8Array[4] === 0x66 && uint8Array[5] === 0x74 && uint8Array[6] === 0x79 && uint8Array[7] === 0x70) {
        return 'video/mp4'; // MP4
      } else {
        return 'unknown'; // Tipo de arquivo desconhecido
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
