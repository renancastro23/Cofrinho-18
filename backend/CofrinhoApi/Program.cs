<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 168028bf464bfe8038dcb9cce353e1e43b8d85b6

using CofrinhoApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<InstitutionalEmailService>();
<<<<<<< HEAD
>>>>>>> e9c7fe9 (MailKit)
=======
>>>>>>> 168028bf464bfe8038dcb9cce353e1e43b8d85b6
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// ===== Pipeline =====
=======
>>>>>>> ab5c9e4 (adding MORE IMPORTE FILES)
=======
app.UseCors("AllowReact");

>>>>>>> e9c7fe9 (MailKit)
=======
app.UseCors("AllowReact");

>>>>>>> 168028bf464bfe8038dcb9cce353e1e43b8d85b6
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
<<<<<<< HEAD
<<<<<<< HEAD

// ATENÇÃO: CORS antes de Authorization
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

=======
app.UseAuthorization();
>>>>>>> ab5c9e4 (adding MORE IMPORTE FILES)
=======
app.UseAuthorization();
>>>>>>> 168028bf464bfe8038dcb9cce353e1e43b8d85b6
app.MapControllers();

app.Run();