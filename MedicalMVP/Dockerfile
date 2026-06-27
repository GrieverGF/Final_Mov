# Usar una imagen base de Ubuntu
FROM ubuntu:22.04

# Variables de entorno para Android SDK
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/emulator
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias esenciales
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    zip \
    wget \
    openjdk-17-jdk \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instalar Node.js (v18)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    npm install -g react-native-cli

# Descargar e instalar Android Command Line Tools
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
    cd ${ANDROID_SDK_ROOT}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O cmdline-tools.zip && \
    unzip -q cmdline-tools.zip && \
    rm cmdline-tools.zip && \
    mv cmdline-tools latest

# Aceptar licencias de Android e instalar plataformas y build-tools
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Directorio de trabajo
WORKDIR /app

# (Opcional) Copiar package.json y yarn.lock si existieran para instalar dependencias
# COPY package*.json ./
# RUN npm install

# Exponer el puerto de Metro Bundler
EXPOSE 8081

# Comando por defecto (Mantiene el contenedor vivo o inicia Metro)
CMD ["npx", "react-native", "start", "--host", "0.0.0.0"]
