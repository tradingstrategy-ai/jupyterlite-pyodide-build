import os
from jupyterlite.addons.base import BaseAddon

from pathlib import Path

class FetchAddon(BaseAddon):
    __all__ = ["post_build"]

    def post_build(self, manager):
        output_files_dir=manager.output_dir
        src_files_dir=manager.lite_dir / "overrides"
        print("YAY:",src_files_dir,output_files_dir)

        for r,d,f in os.walk(src_files_dir):
            for name in f:
                src_file=Path(r) / name
                rel= src_file.relative_to(src_files_dir)
                dest_file=output_files_dir / rel
                print("WOO:",src_file,dest_file)
                yield dict(
                        name=f"override copy:{rel} {dest_file}",
                        doc=f"override copy {src_file} to {dest_file}",
                        file_dep=[src_file],
                        targets=[dest_file],
                        actions=[
                            (self.copy_one, [src_file, dest_file]),
                        ],
                    )
