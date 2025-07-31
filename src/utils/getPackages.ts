// utils/getPackages.ts

import supabase from "./supabase";

export async function getPackagesWithGallery() {
  const { data: packages, error } = await supabase.from("package").select(`
      id,
      name,
      description,
      price,
      image_path,
      package_gallery (
        gallery_id,
        gallery (
          id,
          image_path
        )
      )
    `);

  if (error) throw new Error(error.message);

  // Transform nested result
  return packages.map((pkg) => ({
    ...pkg,
    galleries: pkg.package_gallery.map((pg) => pg.gallery),
  }));
}
