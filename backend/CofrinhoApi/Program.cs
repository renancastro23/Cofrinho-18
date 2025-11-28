<<<<<<< HEAD
using CofrinhoApi.Stores; // se você estiver usando o store em algum lugar
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ===== CORS =====
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000") // React
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// ===== Serviços =====
=======
var builder = WebApplication.CreateBuilder(args);

>>>>>>> ab5c9e4 (adding MORE IMPORTE FILES)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

<<<<<<< HEAD
// ===== Pipeline =====
=======
>>>>>>> ab5c9e4 (adding MORE IMPORTE FILES)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
<<<<<<< HEAD

// ATENÇÃO: CORS antes de Authorization
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

=======
app.UseAuthorization();
>>>>>>> ab5c9e4 (adding MORE IMPORTE FILES)
app.MapControllers();

app.Run();
