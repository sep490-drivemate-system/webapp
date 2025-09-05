// Backend .NET C# Models cho Instructor Signup
// Copy các interface này sang backend .NET

using Microsoft.AspNetCore.Http;

namespace YourProject.Models.Instructor
{
    // Request Model cho Controller
    public class InstructorSignupRequest
    {
        public string Email { get; set; } = string.Empty;
        public IFormFile B2LicenseFront { get; set; } = null!;
        public IFormFile B2LicenseBack { get; set; } = null!;
        public IFormFile CccdFront { get; set; } = null!;
        public IFormFile CccdBack { get; set; } = null!;
        public IFormFile ProfessionalCertificate { get; set; } = null!;
        public IFormFile HealthCertificate { get; set; } = null!;
        public IFormFile VehiclePapers { get; set; } = null!;
        public IFormFile VehicleInsurance { get; set; } = null!;
    }

    // Response Model
    public class InstructorSignupResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public InstructorSignupData? Data { get; set; }
        public List<ValidationError>? Errors { get; set; }
    }

    public class InstructorSignupData
    {
        public string InstructorId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // "pending", "approved", "rejected"
        public DateTime SubmittedAt { get; set; }
    }

    public class ValidationError
    {
        public string Field { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    // Controller Example
    /*
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorController : ControllerBase
    {
        [HttpPost("signup")]
        public async Task<ActionResult<InstructorSignupResponse>> Signup(
            [FromForm] InstructorSignupRequest request)
        {
            try
            {
                // Validate files
                if (request.B2LicenseFront == null || request.B2LicenseBack == null)
                    return BadRequest(new InstructorSignupResponse 
                    { 
                        Success = false, 
                        Message = "B2 License files are required" 
                    });

                // Process files and save to database
                var instructorId = await ProcessInstructorRegistration(request);
                
                return Ok(new InstructorSignupResponse
                {
                    Success = true,
                    Message = "Registration submitted successfully",
                    Data = new InstructorSignupData
                    {
                        InstructorId = instructorId,
                        Status = "pending",
                        SubmittedAt = DateTime.UtcNow
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new InstructorSignupResponse
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<ValidationError>
                    {
                        new ValidationError { Field = "general", Message = ex.Message }
                    }
                });
            }
        }
    }
    */
}
