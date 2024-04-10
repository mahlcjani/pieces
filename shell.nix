with import <nixpkgs> {};

mkShellNoCC {
    packages = [
        git
        nodejs_21
        openssh
        vim
    ];
    shellHook = ''
        echo Updating packages...
        npm install
#        npx playwright install
#        npx playwright install-deps
    ''; 
}

