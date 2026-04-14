# Stage 1 - Build
using CloudinaryDotNet;
using static System.Net.WebRequestMethods;
using System.Composition;
using System.Security.Policy;

FROM mcr.microsoft.com / dotnet / sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 2 - Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR / app

COPY--from = build / app / publish.

ENV ASPNETCORE_URLS = http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "DevLog.Api.dll"]