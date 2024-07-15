import matplotlib.pyplot as plt
from numpy import eye, unravel_index

from promis import ProMis
from promis.geo import LocationType, PolarLocation, CartesianLocation

from fastapi import FastAPI, Request


app = FastAPI()

@app.post("/run")
async def run(req: Request):
    # ProMis Parameters
    dimensions = (1024.0, 1024.0)  # Meters
    resolution = (100, 100)        # Pixels
    spatial_samples = 10          # How many maps to generate to compute statistics
    model = await req.body()
    model = model.decode(encoding="utf-8")
    cache = "./cache"            # Where to cache computed data
    types = [                      # Which types to load and compute relations for
        LocationType.BUILDING,
        LocationType.PARK,
        LocationType.PRIMARY,
        LocationType.SECONDARY,
        LocationType.TERTIARY,
        LocationType.OPERATOR
    ]
    tu_darmstadt = PolarLocation(latitude=49.878091, longitude=8.654052)

    # Setup engine and compute distributional clauses
    pmd = ProMis(tu_darmstadt, dimensions, resolution, types, spatial_samples)

    # Set parameters that are unrelated to the loaded map data
    # Here, we imagine the operator to be situated at the center of the mission area
    pmd.add_feature(CartesianLocation(0.0, 0.0, location_type=LocationType.OPERATOR))

    # Compute distributional clauses with uncertainty
    pmd.compute_distributions(30 * eye(2), cache)

    # Generate landscape
    landscape, program_time, compile_time, inference_time = pmd.generate(logic=model, n_jobs=8)

    # Show result
    print(f"Generated Probabilistic Mission Landscape.")
    print(f">> Building the program took {program_time}s.")
    print(f">> Compilation took {compile_time}s.")
    print(f">> Inference took {inference_time}s.")
    data = []
    for i, location in enumerate(landscape.polar_locations.values()):
        index = unravel_index(i, resolution)
        data.append([location.latitude, location.longitude, landscape.data[index]])
    return data