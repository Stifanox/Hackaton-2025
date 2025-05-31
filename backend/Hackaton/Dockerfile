FROM mcr.microsoft.com/dotnet/sdk:8.0

# Tworzymy katalog roboczy

# Instalujemy narzędzia do hot-reload (opcjonalnie dla lepszego UX)
RUN dotnet tool install --global dotnet-watch

# Domyślny entrypoint może być nadpisany w docker-compose
CMD ["dotnet", "watch", "run","--project", "./app/Hackaton.csproj", "--urls=http://0.0.0.0:8080"]
