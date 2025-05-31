using System.Reflection.Metadata;
using Hackaton.Context;
using Hackaton.Middlewares;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Companion;
using QuestPDF.Infrastructure;
using QuestPDF.Previewer;
using Document = QuestPDF.Fluent.Document;

QuestPDF.Settings.License = LicenseType.Community;

Document.Create(container =>
{

}).ShowInCompanion();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient("PVGIS", httpClient =>
{
    httpClient.BaseAddress = new Uri("https://re.jrc.ec.europa.eu/api/v5_3/");
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseMiddleware<GlobalExceptionMiddleware>();

app.MapControllers();

app.Run();